import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertDoctorSchema, insertAppointmentSchema, insertMessageSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "healthcare_secret_key";

interface AuthenticatedRequest extends Request {
  user?: any;
}

// JWT middleware
const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const connectedClients = new Map<string, WebSocket>();

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          // Store client connection with user ID
          connectedClients.set(message.userId, ws);
          ws.send(JSON.stringify({ type: 'auth', status: 'success' }));
        } else if (message.type === 'chat_message') {
          // Store message and broadcast to recipient
          const savedMessage = await storage.createMessage({
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
          });

          // Send to recipient if online
          const recipientWs = connectedClients.get(message.receiverId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify({
              type: 'new_message',
              message: savedMessage,
            }));
          }

          // Send confirmation to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message: savedMessage,
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Remove client from connected clients
      for (const [userId, client] of Array.from(connectedClients.entries())) {
        if (client === ws) {
          connectedClients.delete(userId);
          break;
        }
      }
    });
  });

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, role } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // For demo purposes, simple password comparison (in production, use bcrypt)
      if (user.password !== password || user.role !== role) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ token, user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ token, user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
    res.json({ user: { ...req.user, password: undefined } });
  });

  // Doctor routes
  app.get('/api/doctors', async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      const doctorsWithUserInfo = await Promise.all(
        doctors.map(async (doctor) => {
          const user = await storage.getUser(doctor.userId);
          return {
            ...doctor,
            name: user ? `Dr. ${user.firstName} ${user.lastName}` : 'Unknown Doctor',
            email: user?.email,
          };
        })
      );
      res.json(doctorsWithUserInfo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch doctors' });
    }
  });

  app.post('/api/doctors', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const doctorData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(doctorData);
      res.json(doctor);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.delete('/api/doctors/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const success = await storage.deleteDoctor(req.params.id);
      if (success) {
        res.json({ message: 'Doctor removed successfully' });
      } else {
        res.status(404).json({ message: 'Doctor not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove doctor' });
    }
  });

  // Appointment routes
  app.get('/api/appointments', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let appointments: any[] = [];
      
      if (req.user.role === 'patient') {
        appointments = await storage.getAppointmentsByPatientId(req.user.id);
      } else if (req.user.role === 'doctor') {
        const doctor = await storage.getDoctorByUserId(req.user.id);
        if (doctor) {
          appointments = await storage.getAppointmentsByDoctorId(doctor.id);
        }
      }

      // Populate with doctor/patient info
      const appointmentsWithInfo = await Promise.all(
        appointments.map(async (apt: any) => {
          const doctor = await storage.getDoctor(apt.doctorId);
          const patient = await storage.getUser(apt.patientId);
          const doctorUser = doctor ? await storage.getUser(doctor.userId) : null;
          
          return {
            ...apt,
            doctorName: doctorUser ? `Dr. ${doctorUser.firstName} ${doctorUser.lastName}` : 'Unknown Doctor',
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
            specialty: doctor?.specialty,
          };
        })
      );

      res.json(appointmentsWithInfo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });

  app.get('/api/appointments/today', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Doctor access required' });
      }

      const doctor = await storage.getDoctorByUserId(req.user.id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const appointments = await storage.getTodayAppointmentsByDoctorId(doctor.id);
      
      const appointmentsWithPatientInfo = await Promise.all(
        appointments.map(async (apt) => {
          const patient = await storage.getUser(apt.patientId);
          return {
            ...apt,
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
          };
        })
      );

      res.json(appointmentsWithPatientInfo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch today appointments' });
    }
  });

  app.post('/api/appointments', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      if (req.user.role === 'patient') {
        appointmentData.patientId = req.user.id;
      }
      
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // Chat routes
  app.get('/api/chat/conversations', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const chatList = await storage.getChatListForUser(req.user.id);
      res.json(chatList);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  });

  app.get('/api/chat/messages/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const messages = await storage.getMessagesBetweenUsers(req.user.id, req.params.userId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(req.params.userId, req.user.id);
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.post('/api/chat/messages', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      messageData.senderId = req.user.id;
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // Profile routes
  app.put('/api/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      delete updates.id;
      delete updates.password; // Don't allow password updates through this endpoint
      delete updates.role; // Don't allow role changes
      
      const updatedUser = await storage.updateUser(req.user.id, updates);
      if (updatedUser) {
        res.json({ user: { ...updatedUser, password: undefined } });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // Admin stats route
  app.get('/api/admin/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const doctors = await storage.getAllDoctors();
      const allUsers = Array.from((storage as any).users.values());
      const patients = allUsers.filter((user: any) => user.role === 'patient');
      const allAppointments = Array.from((storage as any).appointments.values());
      
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const todayAppointments = allAppointments.filter((apt: any) => 
        apt.appointmentDate >= startOfDay && apt.appointmentDate < endOfDay
      );

      res.json({
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        pendingIssues: 3, // Mock data
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  return httpServer;
}
