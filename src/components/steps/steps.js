import React, { useEffect, useState } from "react";
// Css
import '../../assets/styles/components/steps.css';

const Steps = ({ show }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (show) {
            setAnimate(true);
        }
    }, [show]);

    const stepsDetail = [
        {
            title: "Resimleri İncele",
            subTitle: "İlgini çeken hoşuan giden resimleri incele.",
            icon: "image_search"
        },
        {
            title: "Üye Ol",
            subTitle: "Mailini girerek güncel olarak ürünlerimi takip et.",
            icon: "login"
        },
        {
            title: "Satın Al",
            subTitle: "Beğendiğin veya istediğin ürünleri satın al.",
            icon: "shopping_cart"
        }
    ]

    return (
        <section className="steps-container">
            <div className={`steps ${animate ? 'animated' : ''}`}>
                <h2>3 Steps to Start</h2>

                <div className='stepsCard-container'>
                    {
                        stepsDetail?.map((step, index) => (
                            <div key={step.title} className={`steps-card cards-${index}`}>
                                <div className="icon">
                                    <span className="material-icons">{step.icon}</span>
                                </div>
                                <p className='title'>{step.title}</p>
                                <p className='subtitle'>{step.subTitle}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default Steps;
