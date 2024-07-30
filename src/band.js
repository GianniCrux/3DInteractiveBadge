import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, useRopeJoint } from '@react-three/rapier';
import { extend } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'threejs-meshline';

// Extend react-three-fiber with MeshLine and MeshLineMaterial
extend({ MeshLine, MeshLineMaterial });

export function Band() {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), 
    new THREE.Vector3(), 
    new THREE.Vector3(), 
    new THREE.Vector3()
  ]));

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);

  useFrame(() => {
    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.translation());
    curve.points[2].copy(j1.current.translation());
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(32));
  });

  return (
    <>
      <RigidBody ref={fixed} type="fixed" />
      <RigidBody ref={j1} position={[0.5, 0, 0]} />
      <RigidBody ref={j2} position={[1, 0, 0]} />
      <RigidBody ref={j3} position={[1.5, 0, 0]} />
      <mesh ref={band}>
        <meshLine attach="geometry" /> {/* Note the use of `attach="geometry"` */}
        <meshLineMaterial 
          attach="material" 
          color="white" 
          resolution={[width, height]} 
          lineWidth={1} 
        />
      </mesh>
    </>
  );
}
