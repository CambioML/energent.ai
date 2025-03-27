import { motion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from './mode-toggle';

export default function Header() {
  const location = useLocation();
  const isAgentPage = location.pathname.startsWith('/agent');

  return (
    <div className={`${isAgentPage ? 'static' : 'sticky'} top-0 z-20 w-full flex justify-between items-center p-5 ${isAgentPage ? 'bg-background border-b' : ''}`}>
      {/* Blur effect layers - only shown on non-agent pages */}
      {!isAgentPage && (
        <>
          <div className="pointer-events-none absolute inset-0 z-[1] h-[20vh] backdrop-blur-[0.0625px] [mask-image:linear-gradient(0deg,transparent_0%,#000_12.5%,#000_25%,transparent_37.5%)]"></div>
          <div className="pointer-events-none absolute inset-0 z-[2] h-[20vh] backdrop-blur-[0.125px] [mask-image:linear-gradient(0deg,transparent_12.5%,#000_25%,#000_37.5%,transparent_50%)]"></div>
          <div className="pointer-events-none absolute inset-0 z-[3] h-[20vh] backdrop-blur-[0.25px] [mask-image:linear-gradient(0deg,transparent_25%,#000_37.5%,#000_50%,transparent_62.5%)]"></div>
          <div className="pointer-events-none absolute inset-0 z-[4] h-[20vh] backdrop-blur-[0.5px] [mask-image:linear-gradient(0deg,transparent_37.5%,#000_50%,#000_62.5%,transparent_75%)]"></div>
          <div className="pointer-events-none absolute inset-0 z-[5] h-[20vh] backdrop-blur-[1px] [mask-image:linear-gradient(0deg,transparent_50%,#000_62.5%,#000_75%,transparent_87.5%)]"></div>
          <div className="pointer-events-none absolute inset-0 z-[6] h-[20vh] backdrop-blur-[2px] [mask-image:linear-gradient(0deg,transparent_62.5%,#000_75%,#000_87.5%,transparent_100%)]"></div>
          <div className="pointer-events-none absolute inset-0 z-[7] h-[20vh] backdrop-blur-[4px] [mask-image:linear-gradient(0deg,transparent_75%,#000_87.5%,#000_100%,transparent_112.5%)]"></div>
        </>
      )}
      
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="z-[10]"
      >
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <span className="font-semibold text-xl">Energent.ai</span>
        </Link>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="z-[10] flex items-center gap-4"
      >
        <ModeToggle />
        <LanguageSwitcher />
      </motion.div>
    </div>
  );
} 