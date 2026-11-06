"use client";
import Modal from '../util/modal/modal';
import { NavLink } from './nav-link';
import styles from './nav.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoMdGlobe } from 'react-icons/io';

const MotionLink = motion(Link);

// Animation variants for the community links
const communityLinksVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1
        }
    }
};

const communityLinkVariants = {
    hidden: { 
        opacity: 0, 
        x: -20,
        scale: 0.95
    },
    visible: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            damping: 20,
            stiffness: 300
        }
    }
};

const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
        scale: 1.05,
        transition: {
            type: "spring" as const,
            damping: 15,
            stiffness: 400
        }
    },
    tap: { 
        scale: 0.95,
        transition: {
            duration: 0.1
        }
    }
};

// Mobile menu animation variants
const mobileMenuVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        filter: "blur(10px)"
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.4,
            delayChildren: 0.15,
            staggerChildren: 0.08,
            ease: "easeOut" as const
        }
    }
};

const mobileNavLinkVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            damping: 25,
            stiffness: 400
        }
    }
};

const closeButtonVariants = {
    rest: { 
        scale: 1,
        rotate: 0 
    },
    hover: { 
        scale: 1.1,
        rotate: 90,
        transition: {
            type: "spring" as const,
            damping: 15,
            stiffness: 400
        }
    },
    tap: { 
        scale: 0.9,
        transition: {
            duration: 0.1
        }
    }
};

export default function Nav() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();
    
    // Define the sections to spy on - try both hero section IDs
    const sectionIds = ['hero-section', 'hero', 'features'];
    const activeSection = useScrollSpy(sectionIds);
    
    // Helper function to determine if a nav link should be active
    const isNavLinkActive = (href: string) => {
        if (href === '/') {
            // Home link is active when on home page and either hero section is active or no specific section is detected
            return pathname === '/' && (!activeSection || activeSection === 'hero-section' || activeSection === 'hero');
        }
        if (href === '/#features') {
            // Features link is active when features section is active
            return pathname === '/' && activeSection === 'features';
        }
        // For other routes, use pathname matching
        return pathname === href;
    };
    
    return (
        <>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>
                    <div style={{
                        position: 'relative',
                        width: '45px',
                        height: '45px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}>
                        <Image style={{
                            objectFit: 'contain',
                            objectPosition: 'center',
                        }} src={"/tymli.png"} alt='Tymli Icon'  fill />
                    </div>
                    <span>Tymli</span>
                </Link>
                <div className={styles.navLinks}>
                    <NavLink href="/" isActive={isNavLinkActive('/')}>Home</NavLink>
                    <NavLink href="/#features" isActive={isNavLinkActive('/#features')}>Features</NavLink>
                    <NavLink href="/pricing" isActive={isNavLinkActive('/pricing')}>Pricing</NavLink>
                    <NavLink href="/about" isActive={isNavLinkActive('/about')}>About</NavLink>
                </div>
                <div className={styles.cta}>
                    <motion.button 
                        onClick={() => setIsOpen(true)} 
                        className={styles.communityCta}
                    >
                        <IoMdGlobe style={{
                            fontSize: '20px',
                        }} />
                    </motion.button>
                    <MotionLink
                        className={styles.communityButton}
                        href={"/download"}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Download
                    </MotionLink>
                </div>
                
                {/* Mobile hamburger menu button */}
                <motion.button 
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                >
                    <motion.div
                        className={styles.hamburgerLine}
                        animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div
                        className={styles.hamburgerLine}
                        animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div
                        className={styles.hamburgerLine}
                        animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.button>
            </nav>
            <Modal 
            title="Join Our Community"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            >
                <motion.div 
                    className={styles.communityLinks}
                    variants={communityLinksVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.a 
                        href="https://discord.gg/zNyxPGTqwn" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.communityLink}
                        variants={communityLinkVariants}
                        whileHover={{ 
                            scale: 1.02, 
                            x: 5,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div 
                            className={styles.logoBox}
                            whileHover={{ 
                                rotate: 5,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.865-.608 1.249a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.249a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                        </motion.div>
                        <div className={styles.linkText}>
                            <div className={styles.appName}>Discord</div>
                            <div className={styles.description}>Chat with us</div>
                        </div>
                    </motion.a>
                    <a href="https://x.com/tymliorg" target="_blank" rel="noopener noreferrer" className={styles.communityLink}>
                        <div className={styles.logoBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </div>
                        <div className={styles.linkText}>
                            <div className={styles.appName}>X (Twitter)</div>
                            <div className={styles.description}>Follow us</div>
                        </div>
                    </a>
                </motion.div>
            </Modal>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        className={styles.navMobile}
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={(e) => {
                            // Close menu if clicking on the backdrop (not on child elements)
                            if (e.target === e.currentTarget) {
                                setMenuOpen(false);
                            }
                        }}
                    >
                    <motion.div 
                        className={styles.linkList}
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={mobileNavLinkVariants}>
                            <div onClick={() => setMenuOpen(false)}>
                                <NavLink href="/" isActive={isNavLinkActive('/')}>Home</NavLink>
                            </div>
                        </motion.div>
                        <motion.div variants={mobileNavLinkVariants}>
                            <div onClick={() => setMenuOpen(false)}>
                                <NavLink href="/#features" isActive={isNavLinkActive('/#features')}>Features</NavLink>
                            </div>
                        </motion.div>
                        <motion.div variants={mobileNavLinkVariants}>
                            <div onClick={() => setMenuOpen(false)}>
                                <NavLink href="/pricing" isActive={isNavLinkActive('/pricing')}>Pricing</NavLink>
                            </div>
                        </motion.div>
                        <motion.div variants={mobileNavLinkVariants}>
                            <div onClick={() => setMenuOpen(false)}>
                                <NavLink href="/about" isActive={isNavLinkActive('/about')}>About</NavLink>
                            </div>
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className={styles.cta}
                        variants={mobileNavLinkVariants}
                    >
                    <motion.button 
                        onClick={() => {
                            setIsOpen(true);
                            setMenuOpen(false);
                        }} 
                        className={styles.communityCta}
                    >
                        <IoMdGlobe style={{
                            fontSize: '20px',
                        }} />
                    </motion.button>
                    <MotionLink
                        className={styles.communityButton}
                        href={"/download"}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => setMenuOpen(false)}
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Download
                    </MotionLink>
                    </motion.div>
                    
                    {/* Close button at the bottom center */}
                    <motion.div 
                        className={styles.closeButtonContainer}
                        variants={mobileNavLinkVariants}
                    >
                        <motion.button
                            className={styles.closeButton}
                            onClick={() => setMenuOpen(false)}
                            variants={closeButtonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </motion.button>                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    );
}