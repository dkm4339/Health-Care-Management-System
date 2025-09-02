import { type User, type InsertUser, type Doctor, type InsertDoctor, type Appointment, type InsertAppointment, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Doctor operations
  getAllDoctors(): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor | undefined>;
  deleteDoctor(id: string): Promise<boolean>;

  // Appointment operations
  getAppointmentsByPatientId(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]>;
  getTodayAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined>;

  // Message operations
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  getChatListForUser(userId: string): Promise<{ userId: string; userName: string; lastMessage: string; lastMessageTime: Date; unreadCount: number }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private doctors: Map<string, Doctor> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private messages: Map<string, Message> = new Map();

  constructor() {
    // Seed with initial data
    this.seedData();
  }

  private async seedData() {
    // Create admin user
    const adminUser = await this.createUser({
      email: 'admin@healthcare.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });

    // Create doctor users
    const doctorUser1 = await this.createUser({
      email: 'sarah.johnson@healthcare.com',
      password: 'doctor123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'doctor',
    });

    const doctorUser2 = await this.createUser({
      email: 'michael.chen@healthcare.com',
      password: 'doctor123',
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'doctor',
    });

    // Create patient user
    const patientUser = await this.createUser({
      email: 'john.doe@email.com',
      password: 'patient123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'patient',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      address: '123 Main Street, Cityville, State 12345',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1 (555) 987-6543',
      medicalHistory: 'No known allergies. Taking daily vitamins.',
    });

    // Create doctors
    await this.createDoctor({
      userId: doctorUser1.id,
      specialty: 'Cardiology',
      education: 'Harvard Medical School',
      experience: 15,
      rating: 49, // 4.9
      reviewCount: 127,
      isAvailable: true,
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
    });

    await this.createDoctor({
      userId: doctorUser2.id,
      specialty: 'Dermatology',
      education: 'Stanford Medical School',
      experience: 12,
      rating: 47, // 4.7
      reviewCount: 89,
      isAvailable: true,
      bio: 'Dermatology specialist with expertise in skin cancer detection and cosmetic procedures.',
    });

    // Create sample appointments
    const doctor1 = await this.getDoctorByUserId(doctorUser1.id);
    if (doctor1) {
      await this.createAppointment({
        patientId: patientUser.id,
        doctorId: doctor1.id,
        appointmentDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        appointmentType: 'consultation',
        status: 'scheduled',
        notes: 'Regular checkup',
      });
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id, 
      email: insertUser.email,
      password: insertUser.password,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      role: insertUser.role,
      phone: insertUser.phone || null,
      dateOfBirth: insertUser.dateOfBirth || null,
      address: insertUser.address || null,
      emergencyContact: insertUser.emergencyContact || null,
      emergencyPhone: insertUser.emergencyPhone || null,
      medicalHistory: insertUser.medicalHistory || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Doctor operations
  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    return Array.from(this.doctors.values()).find(doctor => doctor.userId === userId);
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = randomUUID();
    const doctor: Doctor = { 
      id, 
      userId: insertDoctor.userId,
      specialty: insertDoctor.specialty,
      education: insertDoctor.education || null,
      experience: insertDoctor.experience || null,
      rating: insertDoctor.rating || null,
      reviewCount: insertDoctor.reviewCount || null,
      isAvailable: insertDoctor.isAvailable || null,
      bio: insertDoctor.bio || null,
      createdAt: new Date() 
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor | undefined> {
    const doctor = this.doctors.get(id);
    if (!doctor) return undefined;
    
    const updatedDoctor = { ...doctor, ...updates };
    this.doctors.set(id, updatedDoctor);
    return updatedDoctor;
  }

  async deleteDoctor(id: string): Promise<boolean> {
    return this.doctors.delete(id);
  }

  // Appointment operations
  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.patientId === patientId);
  }

  async getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.doctorId === doctorId);
  }

  async getTodayAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return Array.from(this.appointments.values()).filter(apt => 
      apt.doctorId === doctorId && 
      apt.appointmentDate >= startOfDay && 
      apt.appointmentDate < endOfDay
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { 
      id, 
      patientId: insertAppointment.patientId,
      doctorId: insertAppointment.doctorId,
      appointmentDate: insertAppointment.appointmentDate,
      appointmentType: insertAppointment.appointmentType,
      status: insertAppointment.status || 'scheduled',
      notes: insertAppointment.notes || null,
      createdAt: new Date() 
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Message operations
  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  async getChatListForUser(userId: string): Promise<{ userId: string; userName: string; lastMessage: string; lastMessageTime: Date; unreadCount: number }[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(msg => msg.senderId === userId || msg.receiverId === userId);

    const chatMap = new Map<string, { lastMessage: string; lastMessageTime: Date; unreadCount: number }>();

    for (const msg of userMessages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const existing = chatMap.get(otherUserId);
      
      if (!existing || msg.timestamp! > existing.lastMessageTime) {
        const unreadCount = msg.receiverId === userId && !msg.isRead ? 
          (existing?.unreadCount || 0) + 1 : (existing?.unreadCount || 0);
        
        chatMap.set(otherUserId, {
          lastMessage: msg.content,
          lastMessageTime: msg.timestamp!,
          unreadCount,
        });
      }
    }

    const result = [];
    for (const [otherUserId, chatData] of Array.from(chatMap.entries())) {
      const otherUser = await this.getUser(otherUserId);
      if (otherUser) {
        result.push({
          userId: otherUserId,
          userName: `${otherUser.firstName} ${otherUser.lastName}`,
          ...chatData,
        });
      }
    }

    return result.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      isRead: false
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    for (const [id, message] of Array.from(this.messages.entries())) {
      if (message.senderId === senderId && message.receiverId === receiverId) {
        this.messages.set(id, { ...message, isRead: true });
      }
    }
  }
}

export const storage = new MemStorage();
