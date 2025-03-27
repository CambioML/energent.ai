import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  // Get the current language label
  const getCurrentLanguageLabel = () => {
    switch (i18n.language) {
      case 'zh': 
        return '中文';
      case 'en':
      default:
        return 'English';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <div>
              <Globe className="h-4 w-4" />
            </div>
            <span>{getCurrentLanguageLabel()}</span>
            <div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <AnimatePresence>
          {open && (
            <DropdownMenuContent align="end" forceMount>
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuItem 
                  onClick={() => changeLanguage('en')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {i18n.language === 'en' && <Check className="h-4 w-4" />}
                  <span className={i18n.language === 'en' ? "font-medium" : ""}>English</span>
                </DropdownMenuItem>
                {/* TODO: Only support English for now */}
                {/* <DropdownMenuItem 
                  onClick={() => changeLanguage('zh')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {i18n.language === 'zh' && <Check className="h-4 w-4" />}
                  <span className={i18n.language === 'zh' ? "font-medium" : ""}>中文</span>
                </DropdownMenuItem> */}
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    </motion.div>
  );
} 