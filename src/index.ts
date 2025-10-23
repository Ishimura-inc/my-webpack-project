import "./styles/main.scss";
import "./styles/krug.scss";
import { gsap } from "gsap";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const circle = document.querySelector(".circle-container") as HTMLElement;
const dots = Array.from(circle.querySelectorAll(".dot")) as HTMLElement[];
const container = circle.parentElement!;

// === элемент для текста активного dot ===
const activeText = document.createElement("div");
activeText.classList.add("active-text");
container.appendChild(activeText);


const dateDisplay = document.querySelector(".date-display") as HTMLElement;
const dateStart = dateDisplay.querySelector(".date-start") as HTMLElement;
const dateEnd = dateDisplay.querySelector(".date-end") as HTMLElement;

function animateNumber(
    element: HTMLElement,
    start: number,
    end: number,
    duration = 1
) {
    const obj = { val: start };
    gsap.to(obj, {
        val: end,
        duration: duration,
        ease: "power1.inOut",
        roundProps: "val", // округляет до целого
        onUpdate: () => {
            element.textContent = obj.val.toString();
        },
    });
}


function updateDates(dotIndex: number) {
    const [startStr, endStr] = dotDates[dotIndex];
    const start = Number(dateStart.textContent); // текущее значение
    const end = Number(startStr);                // новое значение для левой даты
    animateNumber(dateStart, start, end, 0.8);

    const start2 = Number(dateEnd.textContent); // текущее значение второй даты
    const end2 = Number(endStr);                // новое значение для правой даты
    animateNumber(dateEnd, start2, end2, 0.8);
}

// === уже существующий div для отображения текущего dot ===
const currentDotDisplay = document.querySelector(".current-dot-display") as HTMLElement;

let currentRotation = 0;
const N = Number(getComputedStyle(circle).getPropertyValue("--dot-count"));
const anglePerDot = 360 / N;

// === Текст активного dot ===
const dotTexts: string[] = [
    "Наука", // dot-1
    "Текст 2", // dot-2
    "Текст 3", // dot-3
    "Текст 4", // dot-4
    "Текст 5", // dot-5
    "Текст 6", // dot-6
];

const dotDates: [string, string][] = [
    ["1930", "1945"],  // dot-1
    ["1946", "1969"],  // dot-2
    ["1970", "1985"],  // dot-3
    ["1986", "1999"],  // dot-4
    ["2000", "2015"],  // dot-5
    ["2016", "2023"],  // dot-6
];

// === стартовая позиция текста над dot-1 ===
const startPos = { x: 207, y: -229 };
let textPos = { ...startPos };

// === центр круга ===
function getCenter() {
    return {
        x: circle.offsetLeft + circle.offsetWidth / 2,
        y: circle.offsetTop + circle.offsetHeight / 2,
    };
}

// === форматирование числа с ведущим нулём ===
function formatNum(num: number) {
    return num.toString().padStart(2, "0");
}

// === функция обновления отображения номера слева снизу ===
function updateDotDisplay(currentIndex: number) {
    if (currentDotDisplay) {
        currentDotDisplay.textContent = `${formatNum(currentIndex + 1)}/${formatNum(N)}`;
    }
}

// === сразу ставим текст над dot-1 ===
const center = getCenter();
activeText.style.left = `${center.x + startPos.x}px`;
activeText.style.top = `${center.y + startPos.y}px`;
activeText.textContent = dotTexts[0];
activeText.style.opacity = "1";
dots[0].classList.add("active");
updateDotDisplay(0);

// === Swiper-ы для каждого dot ===
Swiper.use([Navigation, Pagination]);
const swiperEls = Array.from(document.querySelectorAll<HTMLElement>(".mySwiper"));


const swipers = swiperEls.map(swiperEl => {
    const prevBtn = swiperEl.querySelector(".swiper-button-prev") as HTMLElement;
    const nextBtn = swiperEl.querySelector(".swiper-button-next") as HTMLElement;

    return new Swiper(swiperEl, {
        modules: [Navigation, Pagination],
        slidesPerView: "auto",
        loop: false,
        spaceBetween: 30,
        centeredSlides: false,       // <— не центрировать активный
        navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
        },
        pagination: {
            el: swiperEl.querySelector(".swiper-pagination") as HTMLElement,
            clickable: true,
        },
        on: {
            init(this: Swiper) {
                updateNavButtons(this, prevBtn, nextBtn);
            },
            slideChange(this: Swiper) {
                updateNavButtons(this, prevBtn, nextBtn);
            },
        },
    });
});

// === функция обновления стрелок ===
function updateNavButtons(swiper: Swiper, prevBtn: HTMLElement, nextBtn: HTMLElement) {
    const { isBeginning, isEnd } = swiper;
    if (prevBtn) prevBtn.style.display = isBeginning ? "none" : "block";
    if (nextBtn) nextBtn.style.display = isEnd ? "none" : "block";
}




// === функция показа Swiper для выбранного dot ===
function showSwiperForDot(index: number) {
    swipers.forEach((swiper, i) => {
        const el = swiper.el as HTMLElement;
        const isActive = i === index;
        el.classList.toggle("active", isActive);

        if (isActive) {
            // Обновляем Swiper, чтобы он знал свои размеры и положение
            swiper.update();

            // Теперь можно безопасно обновить состояние стрелок
            const prevBtn = el.querySelector(".swiper-button-prev") as HTMLElement;
            const nextBtn = el.querySelector(".swiper-button-next") as HTMLElement;
            updateNavButtons(swiper, prevBtn, nextBtn);
        }
    });
}

// === функция смены активного dot с дуговой анимацией текста ===
function setActiveDot(index: number, direction: "left" | "right" | null = null) {
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    const center = getCenter();

    let targetPos = { ...startPos };
    if (direction === "left") targetPos = { x: -40, y: -235 };
    if (direction === "right") targetPos = { x: 335, y: 0 };

    if (direction) {
        const startRadius = Math.sqrt(textPos.x ** 2 + textPos.y ** 2);
        const endRadius = Math.sqrt(targetPos.x ** 2 + targetPos.y ** 2);
        const startAngle = Math.atan2(textPos.y, textPos.x);
        const endAngle = Math.atan2(targetPos.y, targetPos.x);

        gsap.to({ t: 0 }, {
            t: 1,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: function () {
                const t = (this.targets()[0] as any).t;
                const angle = startAngle + (endAngle - startAngle) * t;
                const radius = startRadius + (endRadius - startRadius) * t;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                activeText.style.left = `${center.x + x}px`;
                activeText.style.top = `${center.y + y}px`;
            },
            onComplete: function () {
                textPos = { ...startPos };
                activeText.textContent = dotTexts[index];
                activeText.style.left = `${center.x + textPos.x}px`;
                activeText.style.top = `${center.y + textPos.y}px`;
                activeText.style.opacity = "1";
                updateDotDisplay(index);
                updateDates(index);
            },
        });

        gsap.fromTo(activeText, { opacity: 1 }, { opacity: 0, duration: 0.35, ease: "power2.inOut", delay: 0 });
    } else {
        activeText.textContent = dotTexts[index];
        activeText.style.left = `${center.x + startPos.x}px`;
        activeText.style.top = `${center.y + startPos.y}px`;
        activeText.style.opacity = "1";
        textPos = { ...startPos };
        updateDotDisplay(index);
    }

    // === переключаем Swiper для выбранного dot ===
    showSwiperForDot(index);
}

// === вычисление активного dot на основе текущего вращения ===
function updateActiveDotByRotation(direction: "left" | "right" | null) {
    const index = (N - Math.round((currentRotation / anglePerDot) % N) + N) % N;
    setActiveDot(index, direction);
}

// === клики по кружкам ===
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        if (dot.classList.contains("active")) return;

        updateDates(index);

        const targetAngle = index * anglePerDot;
        let rotationDiff = targetAngle - (-currentRotation % 360);
        if (rotationDiff > 180) rotationDiff -= 360;
        if (rotationDiff < -180) rotationDiff += 360;
        const newRotation = currentRotation - rotationDiff;
        const direction = newRotation > currentRotation ? "right" : "left";

        gsap.to(circle, {
            rotation: newRotation,
            duration: 1,
            transformOrigin: "50% 50%",
            ease: "power2.inOut",
            onUpdate: function () {
                const rotation = gsap.getProperty(circle, "rotation") as number;
                circle.style.setProperty("--rotation", `${-rotation}deg`);
            },
        });

        currentRotation = newRotation;
        updateActiveDotByRotation(direction);
    });
});

// === кнопки круга ===
(document.getElementById("rotate-left") as HTMLButtonElement).addEventListener("click", () => {
    currentRotation -= anglePerDot;

    const newIndex = (N - Math.round((currentRotation / anglePerDot) % N) + N) % N;
    updateDates(newIndex);

    gsap.to(circle, {
        rotation: currentRotation,
        duration: 1,
        transformOrigin: "50% 50%",
        ease: "power2.inOut",
        onUpdate: function () {
            const rotation = gsap.getProperty(circle, "rotation") as number;
            circle.style.setProperty("--rotation", `${-rotation}deg`);
        },
    });
    updateActiveDotByRotation("left");
});

(document.getElementById("rotate-right") as HTMLButtonElement).addEventListener("click", () => {
    currentRotation += anglePerDot;

    const newIndex = (N - Math.round((currentRotation / anglePerDot) % N) + N) % N;
    updateDates(newIndex);

    gsap.to(circle, {
        rotation: currentRotation,
        duration: 1,
        transformOrigin: "50% 50%",
        ease: "power2.inOut",
        onUpdate: function () {
            const rotation = gsap.getProperty(circle, "rotation") as number;
            circle.style.setProperty("--rotation", `${-rotation}deg`);
        },
    });
    updateActiveDotByRotation("right");
});

// === обновление текста при изменении размера окна ===
window.addEventListener("resize", () => {
    updateActiveDotByRotation(null);
});

// === показываем первый Swiper при старте ===
showSwiperForDot(0);

const verticalLine = document.querySelector<HTMLElement>(".vertical-line")!;
const horizontalLine = document.querySelector<HTMLElement>(".horizontal-line")!;

function updateLines() {
    const circleRect = circle.getBoundingClientRect();
    const swiperRect = document.querySelector<HTMLElement>(".swiper-top-position")!.getBoundingClientRect();
    const container = document.querySelector<HTMLElement>(".container")!;
    const containerRect = container.getBoundingClientRect();

    // === Центральная линия через круг ===
    const centerX = circleRect.left + circleRect.width / 2;
    const centerY = circleRect.top + circleRect.height / 2;

    verticalLine.style.left = `${centerX}px`;
    horizontalLine.style.top = `${centerY}px`;

    // Длина до конца Swiper
    const fullHeight = swiperRect.bottom;
    verticalLine.style.height = `${fullHeight}px`;

    // === Линии по краям контейнера ===
    const leftLine = document.querySelector<HTMLElement>(".vertical-line.left")!;
    const rightLine = document.querySelector<HTMLElement>(".vertical-line.right")!;

    leftLine.style.height = `${fullHeight}px`;
    rightLine.style.height = `${fullHeight}px`;

    // absolute линии относительно container
    leftLine.style.left = `0px`;
    rightLine.style.left = `${containerRect.width}px`;
}

// Изначально
updateLines();

// При ресайзе окна
window.addEventListener("resize", updateLines);

