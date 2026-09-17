package com.taxedge.notification.service;

public interface FcmNotificationService {
    void sendRegistrationSuccessNotification(String targetDeviceToken, String userName);
}

