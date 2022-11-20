import { useEffect } from "react";


const bubbleWrapperStyles: React.CSSProperties = {
  height: '100%',
  width: '100%',
  position: 'fixed',
  bottom: '0px',
  overflow: 'hidden',
  pointerEvents: 'none'
}


export function LiquidAnimation(): JSX.Element {

  useEffect(() => {
    const wrapper = document.getElementById('bubble-wrapper');
    const animateBubble = (x: number) => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.left = `${ x }px`
      wrapper!.appendChild(bubble);
      setTimeout(() => wrapper!.removeChild(bubble), 2000)

    }
    window.onmousemove = e => animateBubble(e.clientX)
    return () => { }
  }, [])

  return <div id="bubble-wrapper" style={bubbleWrapperStyles}>
  </div>
}