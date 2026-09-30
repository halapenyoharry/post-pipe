const fs = require('fs');
let code = fs.readFileSync('src/components/ConfigPanel/ConfigPanel.jsx', 'utf8');

// Remove import createPortal
code = code.replace(/import { createPortal } from 'react-dom';\n/, '');

// Replace the whole ConfigPanel function signature and state up to features
const funcStart = code.indexOf('export function ConfigPanel');
const featuresStart = code.indexOf('  const features = {');

code = code.slice(0, funcStart) + `export function ConfigPanel({ config, onUpdate, onReset, visible = true }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSnippet, setShowSnippet] = useState(false);
  const fileInputRef = useRef(null);

  // Swipe-to-dismiss state
  const touchStartY = useRef(null);
  const panelRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    // If scrolling inside the panel content, don't dismiss immediately unless at top
    if (panelRef.current && panelRef.current.scrollTop > 0) return;

    if (diff > 80) { // Swipe down threshold
      setOpen(false);
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);\n\n` + code.slice(featuresStart);

fs.writeFileSync('src/components/ConfigPanel/ConfigPanel.jsx', code);
