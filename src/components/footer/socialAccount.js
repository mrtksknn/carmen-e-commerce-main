import '../../assets/styles/socialAccount.css';

const SocialAccount = () => {
    return (
        <div className='socialAccount-container'>
            <h2 style={{marginBottom: '20px'}}>SAHNE ARKASINI GÖRMEK İSTER MİSİNİZ? INSTAGRAM'DAN TAKİP EDİN!</h2>

            <div className='socialCards' style={{maxWidth: '75%', width: '100%', height: '230px', marginBottom: '48px', flexWrap: 'wrap'}}>
                <div className='socialCard'></div>
                <div className='socialCard'></div>
                <div className='socialCard'></div>
                <div className='socialCard'></div>
                <div className='socialCard'></div>
            </div>
        </div>
    );
  };
  
export default SocialAccount;
