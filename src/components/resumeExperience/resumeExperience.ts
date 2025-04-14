import template from './resumeExperience.handlebars';
import { WorkExperience } from '../../api/interfaces';
import { logger } from '../../utils/logger';
import './resumeExperience.sass';

export class ResumeExperience {
    readonly #parent: HTMLElement;
    readonly #props: WorkExperience;

    constructor(parent: HTMLElement, props: WorkExperience) {
        this.#parent = parent;
        this.#props = props;
    }

    readonly #duration = (): number => {
        const start_date = new Date(this.#props.start_date);
        if (this.#props.until_now) {
            const end_date = new Date();
            return Math.floor(
                (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24 * 30),
            );
        } else {
            const end_date = new Date(this.#props.end_date);
            return Math.floor(
                (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24 * 30),
            );
        }
    };

    render = () => {
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                duration: this.#duration(),
            }),
        );
        logger.info('ResumeExperience rendered:', this.#props.position);
    };
}
