import { User, Order, InternalEmail } from '../types';
import { storage } from './storage';

// Email service simulation
export const emailService = {
  sendPurchaseConfirmation: async (user: User, order: Order): Promise<void> => {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📧 Purchase Confirmation Email Sent');
    console.log(`To: ${user.email}`);
    console.log(`Subject: Confirmación de Compra - Pedido ${order.orderNumber}`);
    console.log(`Order Total: $${order.total}`);
    console.log('---');

    // Send to internal emails
    const internalEmails = storage.get<InternalEmail>('travel_portal_internal_emails');
    internalEmails.forEach(email => {
      console.log(`📧 Internal Notification Sent to ${email.sector}: ${email.email}`);
    });
  },

  sendDeliveryConfirmation: async (user: User, order: Order): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📧 Delivery Confirmation Email Sent');
    console.log(`To: ${user.email}`);
    console.log(`Subject: Pedido Entregado - ${order.orderNumber}`);
    console.log(`Delivery Date: ${order.deliveryDate}`);
    console.log('---');
  },

  sendWelcomeEmail: async (user: User): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('📧 Welcome Email Sent');
    console.log(`To: ${user.email}`);
    console.log(`Subject: ¡Bienvenido a Travel Portal!`);
    console.log('---');
  }
};