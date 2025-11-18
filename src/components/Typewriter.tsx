import React from 'react'
import Typewriter from 'typewriter-effect'

interface TypewriterProps {
  strings?: string[]
  className?: string
}

const TypewriterComponent: React.FC<TypewriterProps> = ({
  strings = ['Lyghtlyn Gaming'],
  className = ''
}) => {
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      <Typewriter
        options={{
          strings: strings,
          autoStart: true,
          loop: true,
          deleteSpeed: 50,
          delay: 100,
       //   cursor: '|',
          wrapperClassName: 'Typewriter__wrapper',
          //pauseFor: 2000
        }}
      />
    </span>
  )
}

export default TypewriterComponent

