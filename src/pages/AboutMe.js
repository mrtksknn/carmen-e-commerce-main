import '../assets/styles/aboutMe.css';

const AboutMe = () => {

  const avatarImage = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url("https://loremflickr.com/640/480/people")'
  };

    return (
      <div className="aboutMe-container">
        <div className='page-header'>
          <h4><a href="/">Anasayfa</a></h4>
          <h4 style={{fontSize: '24px'}}>/</h4>
          <h4>Hakkımda</h4>
        </div>
        <div style={avatarImage} className="owner-image"></div>

        <div className='owner-txt'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed hendrerit risus in metus tristique, a congue neque hendrerit.
            In hac habitasse platea dictumst. Ut pulvinar, velit in vestibulum convallis,
            velit diam ultricies massa, nec auctor elit sapien eu elit. Nulla facilisi.
            Nunc aliquam felis et lectus sodales, ac feugiat mi convallis.
          </p>
          <br />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed hendrerit risus in metus tristique, a congue neque hendrerit.
            In hac habitasse platea dictumst. Ut pulvinar, velit in vestibulum convallis,
            velit diam ultricies massa, nec auctor elit sapien eu elit. Nulla facilisi.
            Nunc aliquam felis et lectus sodales, ac feugiat mi convallis.
          </p>
          <br />
          <p>
            İnsanların resimlerime bakarken kendinden bir parça bulması ve herkesin
            aynı resimle başka duygular hissetmesi bu işin en sevdiğim yanlarından biri.
          </p>
          <br />
          <p>
            Sanatın daha fazla olduğu renkli ve güzel bir dünya diliyorum
          </p>
        </div>
      </div>
    );
  };
  
  export default AboutMe;