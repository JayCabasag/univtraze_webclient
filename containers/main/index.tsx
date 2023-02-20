import React, { useEffect, useState } from 'react'
import BackToTopButton from '@/components/back-to-top-button'
import AboutContainer from '../../containers/main/About'
import FeaturesContainer from '../../containers/main/Features'
import FooterContainer from '../../containers/main/Footer'
import HomeContainer from '../../containers/main/Home'
import Navbar from '../../containers/main/Navbar'
import Reports from '../../containers/main/Reports'

export default function MainContainer() {

  const [scrolled, setScrolled] = useState(false); 

  useEffect(() => {
    function handleScroll() {
        if (window.scrollY > 100) {
        setScrolled(true);
        } else {
        setScrolled(false);
        }
    }
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  

  return (
    <main className=''>
      <Navbar />
      <HomeContainer />
      <AboutContainer />
      <FeaturesContainer />
      <Reports />
      <FooterContainer />
      {scrolled && <BackToTopButton />}
    </main>
  )
}
