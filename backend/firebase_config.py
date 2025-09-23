"""
Firebase configuration and initialization
TODO: Replace with your actual Firebase configuration
"""

import os
from firebase_admin import credentials, firestore, initialize_app
import firebase_admin
from decouple import config

# Firebase Service Account Configuration
# TODO: Replace these with your actual Firebase service account details
FIREBASE_CONFIG = {
    "type": "service_account",
    "project_id": config("FIREBASE_PROJECT_ID", default="your-project-id"),
    "private_key_id": config("FIREBASE_PRIVATE_KEY_ID", default="your-private-key-id"),
    "private_key": config("FIREBASE_PRIVATE_KEY", default="your-private-key").replace('\\n', '\n'),
    "client_email": config("FIREBASE_CLIENT_EMAIL", default="your-client-email"),
    "client_id": config("FIREBASE_CLIENT_ID", default="your-client-id"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": config("FIREBASE_CLIENT_CERT_URL", default="your-client-cert-url")
}

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if Firebase is already initialized
        if not firebase_admin._apps:
            cred = credentials.Certificate(FIREBASE_CONFIG)
            initialize_app(cred)
            print("Firebase initialized successfully")
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        # For development, you can return None and handle gracefully
        return None

def get_firestore_client():
    """Get Firestore client instance"""
    return initialize_firebase()