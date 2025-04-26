import '../../assets/styles/footer.css';
import SocialAccount from './socialAccount';

const Footer = () => {
    return (
        <footer className="footer-container">
<SocialAccount />

            <div className='footer'>

                <div style={{gap: "12px", display: "flex", flexDirection: "column"}}>
                    <label>Gelişmelerden, yeni ürünlerden ve daha fazlası için üye olun...</label>
                    <input
                        className='subscribe'
                        style={{
                            width:"350px",
                            height: "48px",
                            padding: "18px 20px",
                            color: '#777E90',
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: "#393939"
                        }}
                        type="mail"
                        placeholder="Mailinizi giriniz..."
                        autoFocus
                    ></input>
                </div>

            </div>

            <span className='patent'>© 2024 Carmen Tüm Hakları Saklıdır.</span>
        </footer>
    );
  };
  
  export default Footer;

