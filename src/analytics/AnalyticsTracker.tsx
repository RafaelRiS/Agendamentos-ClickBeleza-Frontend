import { useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type AnalyticsEvent = {
    type: "click" | "mousemove" | "scroll";
    page: string;
    screen?: string;
    element?: string;
    x?: number;
    y?: number;
    viewportWidth?: number;
    viewportHeight?: number;
};

const AnalyticsTracker = () => {
    const eventsRef = useRef<AnalyticsEvent[]>([]);
    const lastMouseMoveRef = useRef(0);
    const lastScrollRef = useRef(0);
    const sendingRef = useRef(false);

    const currentScreenRef = useRef("service");

    const addEvent = (event: AnalyticsEvent) => {
        eventsRef.current.push(event);

        // Envia automaticamente quando chegar a 20 eventos
        if (eventsRef.current.length >= 20) {
            sendEvents();
        }
    };

    const sendEvents = async () => {

        // Evita dois envios simultâneos
        if (sendingRef.current) {
            return;
        }

        if (eventsRef.current.length === 0) {
            return;
        }

        sendingRef.current = true;

        const events = [...eventsRef.current];

        eventsRef.current = [];

        try {

            await fetch(`${API_URL}/analytics/events`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    events,
                }),

                keepalive: true,
            });

        } catch (error) {

            console.error(
                "Erro ao enviar analytics:",
                error
            );

            // Devolve os eventos para a fila
            eventsRef.current = [
                ...events,
                ...eventsRef.current,
            ].slice(-100);

        } finally {

            sendingRef.current = false;

        }
    };

    useEffect(() => {

        /*
         * ALTERAÇÃO DA TELA DO AGENDAMENTO
         *
         * service
         * barber
         * time
         * confirmation
         */
        const handleScreenChange = (event: Event) => {

            const customEvent =
                event as CustomEvent<{ screen: string }>;

            currentScreenRef.current =
                customEvent.detail.screen;
        };


        window.addEventListener(
            "analytics-screen-change",
            handleScreenChange
        );


        /*
         * CLICK
         */
        const handleClick = (event: MouseEvent) => {

            const target =
                event.target as HTMLElement;


            /*
             * Procura o elemento clicado.
             *
             * Primeiro tenta encontrar algo
             * com data-analytics.
             *
             * Depois tenta button, a, input etc.
             */
            const element =
                target.closest(
                    "[data-analytics], button, a, input, select, textarea"
                ) as HTMLElement | null;


            /*
             * Nome do elemento.
             */
            const elementName =
                element?.getAttribute("data-analytics") ||
                element?.innerText?.trim() ||
                element?.getAttribute("aria-label") ||
                element?.getAttribute("title") ||
                element?.tagName ||
                "unknown";


            addEvent({

                type: "click",

                page: window.location.pathname,

                screen: currentScreenRef.current,

                element: elementName,

                x: event.clientX,

                y:
                    event.clientY +
                    window.scrollY,

                viewportWidth:
                window.innerWidth,

                viewportHeight:
                document.documentElement
                    .scrollHeight,
            });

        };


        /*
         * MOUSEMOVE
         *
         * Registra no máximo 1 movimento
         * a cada 250ms.
         */
        const handleMouseMove = (event: MouseEvent) => {

            const now = Date.now();

            if (
                now -
                lastMouseMoveRef.current <
                250
            ) {
                return;
            }

            lastMouseMoveRef.current = now;


            addEvent({

                type: "mousemove",

                page: window.location.pathname,

                screen: currentScreenRef.current,

                x: event.clientX,

                y:
                    event.clientY +
                    window.scrollY,

                viewportWidth:
                window.innerWidth,

                viewportHeight:
                document.documentElement
                    .scrollHeight,
            });

        };


        /*
         * SCROLL
         *
         * Registra no máximo 1 evento
         * a cada 500ms.
         */
        const handleScroll = () => {

            const now = Date.now();

            if (
                now -
                lastScrollRef.current <
                500
            ) {
                return;
            }

            lastScrollRef.current = now;


            addEvent({

                type: "scroll",

                page: window.location.pathname,

                screen: currentScreenRef.current,

                x: 0,

                y: window.scrollY,

                viewportWidth:
                window.innerWidth,

                viewportHeight:
                document.documentElement
                    .scrollHeight,
            });

        };


        /*
         * EVENT LISTENERS
         */

        document.addEventListener(
            "click",
            handleClick
        );

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        window.addEventListener(
            "scroll",
            handleScroll
        );


        /*
         * Envia os eventos pendentes
         * a cada 5 segundos.
         */
        const interval = setInterval(() => {

            sendEvents();

        }, 5000);


        /*
         * Tenta enviar os eventos
         * quando o usuário sair.
         */
        const handleBeforeUnload = () => {

            sendEvents();

        };


        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        );


        /*
         * CLEANUP
         */
        return () => {

            document.removeEventListener(
                "click",
                handleClick
            );

            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "scroll",
                handleScroll
            );

            clearInterval(interval);

            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );

            window.removeEventListener(
                "analytics-screen-change",
                handleScreenChange
            );

        };

    }, []);


    return null;
};

export default AnalyticsTracker;
