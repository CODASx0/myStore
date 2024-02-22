
import { PivotControls, TransformControls, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'



export default function Experience() {

    const sphere = useRef()

    return <>
        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} />
        <mesh ref={sphere}>
            <sphereGeometry />
            <meshStandardMaterial color="purple" />
        </mesh>

        <TransformControls object={sphere} />
    </>
}