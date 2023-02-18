import BackToTopButton from '@/components/BackToTopButton'
import AboutContainer from '@/containers/About'
import FeaturesContainer from '@/containers/Features'
import FooterContainer from '@/containers/Footer'
import HomeContainer from '@/containers/Home'
import Navbar from '@/containers/Navbar'
import Reports from '@/containers/Reports'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {
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
    <>
      <main className=''>
        <Navbar />
        <HomeContainer />
        <AboutContainer />
        <FeaturesContainer />
        <Reports />
        <FooterContainer />
        {scrolled && <BackToTopButton />}
      </main>
    </>
  )
}
