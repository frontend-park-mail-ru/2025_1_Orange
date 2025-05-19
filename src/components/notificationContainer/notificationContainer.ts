import { NotificationCard } from '../notificationCard/notificationCard';
import './notificationContainer.sass';

class NotificationContainer {
    containerElement: HTMLElement;

    constructor() {
        this.containerElement = document.createElement('div');
        this.containerElement.id = 'notification-container';
        document.body.appendChild(this.containerElement);
    }

    get self(): HTMLElement {
        return this.containerElement;
    }

    add(status: 'OK' | 'FAIL', header: string, message: string | null = null): void {
        const notification = new NotificationCard(this.self, status, header, message);
        notification.render();
    }

    clear(): void {
        this.self.innerHTML = '';
    }
}

// Синглтончик
const notification = new NotificationContainer();
export default notification;
