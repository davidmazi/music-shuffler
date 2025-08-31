// PWA Service Worker Registration and Utilities

interface PWAInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
	interface WindowEventMap {
		beforeinstallprompt: PWAInstallPromptEvent;
	}
}

class PWAManager {
	private deferredPrompt: PWAInstallPromptEvent | null = null;
	private isInstalled = false;

	constructor() {
		this.init();
	}

	private init() {
		// Register service worker
		this.registerServiceWorker();

		// Listen for install prompt
		window.addEventListener(
			"beforeinstallprompt",
			this.handleBeforeInstallPrompt.bind(this),
		);

		// Listen for app installation
		window.addEventListener("appinstalled", this.handleAppInstalled.bind(this));

		// Check if app is already installed
		this.checkIfInstalled();
	}

	private async registerServiceWorker() {
		if ("serviceWorker" in navigator) {
			try {
				const registration = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
				});

				console.log(
					"[PWA] Service Worker registered successfully:",
					registration,
				);

				// Handle service worker updates
				registration.addEventListener("updatefound", () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								// New service worker available
								this.showUpdateNotification();
							}
						});
					}
				});
			} catch (error) {
				console.error("[PWA] Service Worker registration failed:", error);
			}
		} else {
			console.warn("[PWA] Service Worker not supported");
		}
	}

	private handleBeforeInstallPrompt(event: PWAInstallPromptEvent) {
		console.log("[PWA] Install prompt triggered");

		// Prevent the mini-infobar from appearing on mobile
		event.preventDefault();

		// Store the event so it can be triggered later
		this.deferredPrompt = event;

		// Show install button or notification
		this.showInstallPrompt();
	}

	private handleAppInstalled() {
		console.log("[PWA] App was installed");
		this.isInstalled = true;
		this.deferredPrompt = null;

		// Hide install button if it exists
		this.hideInstallPrompt();
	}

	private checkIfInstalled() {
		// Check if running in standalone mode (installed)
		if (
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as any).standalone === true
		) {
			this.isInstalled = true;
			console.log("[PWA] App is running in standalone mode");
		}
	}

	private showInstallPrompt() {
		// Create or show install button
		const installButton = document.getElementById("pwa-install-button");
		if (installButton) {
			installButton.style.display = "block";
			installButton.addEventListener("click", this.installApp.bind(this));
		}
	}

	private hideInstallPrompt() {
		const installButton = document.getElementById("pwa-install-button");
		if (installButton) {
			installButton.style.display = "none";
		}
	}

	private showUpdateNotification() {
		// Show update notification to user
		const updateButton = document.getElementById("pwa-update-button");
		if (updateButton) {
			updateButton.style.display = "block";
			updateButton.addEventListener("click", () => {
				window.location.reload();
			});
		}
	}

	public async installApp() {
		if (!this.deferredPrompt) {
			console.warn("[PWA] No install prompt available");
			return;
		}

		try {
			// Show the install prompt
			await this.deferredPrompt.prompt();

			// Wait for the user to respond to the prompt
			const { outcome } = await this.deferredPrompt.userChoice;

			console.log(`[PWA] User response to install prompt: ${outcome}`);

			// Clear the deferred prompt
			this.deferredPrompt = null;

			// Hide the install button
			this.hideInstallPrompt();
		} catch (error) {
			console.error("[PWA] Error during app installation:", error);
		}
	}

	public isAppInstalled(): boolean {
		return this.isInstalled;
	}

	public canInstall(): boolean {
		return this.deferredPrompt !== null;
	}

	public async checkForUpdates() {
		if ("serviceWorker" in navigator) {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				await registration.update();
			}
		}
	}
}

// Create global PWA manager instance
export const pwaManager = new PWAManager();

// Export utility functions
export const installPWA = () => pwaManager.installApp();
export const isPWAInstalled = () => pwaManager.isAppInstalled();
export const canInstallPWA = () => pwaManager.canInstall();
export const checkPWAUpdates = () => pwaManager.checkForUpdates();

// Export for use in components
export default pwaManager;
