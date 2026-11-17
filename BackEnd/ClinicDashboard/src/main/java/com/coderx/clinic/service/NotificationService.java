package com.coderx.clinic.service;

import com.coderx.clinic.Entity.Notification;
import com.coderx.clinic.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    public Notification createNotification(String title, String message, String type, String targetRole, String actionUrl) {
        Notification notification = new Notification(title, message, type, targetRole, actionUrl);
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setIsRead(true);
            return notificationRepository.save(notif);
        }).orElse(null);
    }

    public void markAllAsRead() {
        List<Notification> list = notificationRepository.findAll();
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }
}

