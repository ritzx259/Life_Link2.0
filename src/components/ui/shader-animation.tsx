'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ShaderAnimation = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Shader material
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 vUv;

      #define PI 3.14159265359

      // Function to create a color gradient
      vec3 colorGradient(float t) {
        // Medical/healthcare color palette
        vec3 color1 = vec3(0.0, 0.4, 0.8); // Blue
        vec3 color2 = vec3(0.8, 0.0, 0.2); // Red
        vec3 color3 = vec3(0.0, 0.6, 0.4); // Teal
        
        if (t < 0.33) {
          return mix(color1, color2, t * 3.0);
        } else if (t < 0.66) {
          return mix(color2, color3, (t - 0.33) * 3.0);
        } else {
          return mix(color3, color1, (t - 0.66) * 3.0);
        }
      }

      void main() {
        // Normalized coordinates
        vec2 uv = vUv;
        
        // Create a flowing pattern
        float time = u_time * 0.2;
        
        // Multiple wave patterns
        float wave1 = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
        float wave2 = sin(uv.y * 8.0 - time * 1.3) * 0.5 + 0.5;
        float wave3 = sin((uv.x + uv.y) * 5.0 + time * 0.7) * 0.5 + 0.5;
        
        // Combine waves
        float waves = (wave1 + wave2 + wave3) / 3.0;
        
        // Add some circular patterns (like cells or blood cells)
        float circle1 = length(uv - vec2(0.5 + sin(time * 0.4) * 0.2, 0.5 + cos(time * 0.3) * 0.2));
        float circle2 = length(uv - vec2(0.7 + sin(time * 0.5) * 0.1, 0.3 + cos(time * 0.6) * 0.1));
        float circle3 = length(uv - vec2(0.3 + sin(time * 0.7) * 0.1, 0.7 + cos(time * 0.8) * 0.1));
        
        // Combine everything
        float pattern = waves * (0.8 + 0.2 * (sin(circle1 * 20.0) + sin(circle2 * 15.0) + sin(circle3 * 25.0)));
        
        // Apply color gradient
        vec3 color = colorGradient(pattern);
        
        // Add some subtle pulsing
        float pulse = 0.95 + 0.05 * sin(time * 2.0);
        color *= pulse;
        
        // Output final color
        gl_FragColor = vec4(color, 0.85); // Slightly transparent
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    // Create a plane that fills the screen
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      uniforms.u_mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
      uniforms.u_mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.x = window.innerWidth;
      uniforms.u_resolution.value.y = window.innerHeight;
    };

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      return animationId;
    };

    // Start animation
    const animationId = animate();

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
};

export default ShaderAnimation;