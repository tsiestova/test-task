window.addEventListener("DOMContentLoaded", (event) => {
    init();
});

function init() {
    const slider = document.getElementById('slider');
    addEventListeners();
    initSlider(slider, 4);
}

const initSlider = (slider, slidesVisible) => {
    let index = 0;

    const sliderList = slider.querySelector('[data-slider]');
    const btnFlipLeft = slider.querySelector('[data-slider-btn="prev"]');
    const btnFlipRight = slider.querySelector('[data-slider-btn="next"]');
    const slidesNumber = slider.querySelectorAll('[data-item]');
    const slidesQuantity = Math.round(slidesNumber.length / slidesVisible) - 1;

    if (btnFlipLeft) {
        btnFlipLeft.addEventListener('click', () => {
            if (index === 0) {
                return;
            }
            index--;
            setPosition(index);
        });
    }

    if (btnFlipRight) {
        btnFlipRight.addEventListener('click', () => {
            if (index === slidesQuantity) {
                return;
            }

            index++;
            setPosition(index);
        });
    }

    function setPosition(position) {
        sliderList.style.transform = `translateX(-${position * 100}%)`;
    }
}

const addEventListeners = () => {
    addModalListeners();
}

function addModalListeners() {
    const modal = document.querySelector('[data-modal]');
    const slider = document.getElementById('slider');
    const slidesNumber = slider.querySelectorAll('[data-item]');
    const modalContent = document.getElementById('slider-content');
    const clone = modalContent.cloneNode(true);
    const modalSlider = document.getElementById('modal-slider')
    const btnContainer = modal.querySelector('.modal-btn-flip-list');
    let activeIndex;

    slidesNumber.forEach((slide, i) => {
        slide.addEventListener("click", () => {
            activeIndex = i;
            createModalContent();
            initModalSlider(modal, activeIndex);
            modal.showModal();
        })
    });

    function createModalContent () {
        const createBtnList = () => {
            let arrOfBtn = [];
            for (let i = 0; i < slidesNumber.length; i++) {
                arrOfBtn.push(`<button type="button" data-value=${i} class="modal-btn-flip"></button>`)
            }

            return arrOfBtn.join('');
        }
        btnContainer.innerHTML = createBtnList();
        modalSlider.appendChild(clone);
    }
}

const initModalSlider = (modal, index) => {
    const btnList = modal.querySelectorAll('.modal-btn-flip');
    const sliderList = modal.querySelector('[data-slider]');
    const closeBtn = modal.querySelector('[data-close-modal-button]');
    const btnContainer = modal.querySelector('[data-moda-page-container]');
    const modalSlider = document.getElementById('modal-slider') ;
    const modalContainer = modal.querySelector('[data-modal-container]');

    //removeActiveAttribute(btnList);
    setActiveAttribute(btnList, index);
    setPosition(sliderList, index);

    function setActiveFrame (index) {
        const activeElement = sliderList.querySelector(`[data-item]:nth-child(${index + 1})`);
        const frame = activeElement.querySelector('iframe');

        return new Vimeo.Player(frame);
    }

    let activePlayer = setActiveFrame(index);
    activePlayer.play()

    btnList.forEach((btn) => {
        btn.addEventListener('click', () => {
            activePlayer.pause();
            removeActiveAttribute(btnList);
            let newActiveIndex = btn.dataset.value;
            btn.setAttribute('data-active', true)
            setPosition(sliderList, newActiveIndex);

            activePlayer = setActiveFrame(parseInt(newActiveIndex, 10));
            activePlayer.play();
        })
    })

    closeBtn.addEventListener('click', closeButtonHandler);

    function closeButtonHandler() {
        activePlayer.pause();
        modal.close();
        btnContainer.innerHTML = '';
        modalContainer.innerHTML = '';
        closeBtn.removeEventListener('click', closeButtonHandler);
    }

    function setPosition(slider, position) {
        slider.style.transform = `translateX(-${position * 100}%)`;
    }

    function setActiveAttribute (list, index) {
        list.forEach((item, i) => {
            i === index ? item.setAttribute('data-active', true) : "";
        })
    }

    function removeActiveAttribute (list) {
        list.forEach((item) => {
            item.removeAttribute('data-active');
        })
    }

}




