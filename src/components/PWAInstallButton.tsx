import React, { useState, useEffect } from 'react';
import { canInstallPWA, installPWA, isPWAInstalled } from '../utils/pwa';
import { Button } from './ui/button';
import { Download, Check } from 'lucide-react';

interface PWAInstallButtonProps {
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
    className = '',
    variant = 'default',
    size = 'default'
}) => {
    const [canInstall, setCanInstall] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        // Check initial state
        setCanInstall(canInstallPWA());
        setIsInstalled(isPWAInstalled());

        // Listen for changes
        const checkInstallState = () => {
            setCanInstall(canInstallPWA());
            setIsInstalled(isPWAInstalled());
        };

        // Check periodically
        const interval = setInterval(checkInstallState, 1000);

        // Listen for app installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setCanInstall(false);
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            clearInterval(interval);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!canInstall) return;

        setIsInstalling(true);
        try {
            await installPWA();
        } catch (error) {
            console.error('Failed to install PWA:', error);
        } finally {
            setIsInstalling(false);
        }
    };

    // Don't render if app is already installed
    if (isInstalled) {
        return null;
    }

    // Don't render if can't install
    if (!canInstall) {
        return null;
    }

    return (
        <Button
            onClick={handleInstall}
            disabled={isInstalling}
            variant={variant}
            size={size}
            className={`pwa-install-button ${className}`}
        >
            {isInstalling ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Installing...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4 mr-2" />
                    Install App
                </>
            )}
        </Button>
    );
};

// Update notification component
export const PWAUpdateButton: React.FC<{
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}> = ({ className = '', variant = 'outline', size = 'default' }) => {
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {
        // Check for update button visibility
        const updateButton = document.getElementById('pwa-update-button');
        if (updateButton) {
            setShowUpdate(updateButton.style.display !== 'none');
        }

        // Listen for updates
        const checkForUpdates = () => {
            const button = document.getElementById('pwa-update-button');
            if (button) {
                setShowUpdate(button.style.display !== 'none');
            }
        };

        const interval = setInterval(checkForUpdates, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!showUpdate) {
        return null;
    }

    return (
        <Button
            onClick={() => window.location.reload()}
            variant={variant}
            size={size}
            className={`pwa-update-button ${className}`}
        >
            <Check className="h-4 w-4 mr-2" />
            Update Available
        </Button>
    );
};

export default PWAInstallButton;
