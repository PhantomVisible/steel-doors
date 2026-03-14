import { Injectable } from '@angular/core';
import * as THREE from 'three';

/**
 * DoorModelService
 * Builds a procedural 3D steel door matching the far-left door in the reference image:
 *  - Cool-grey main panel with etched geometric polygon lines
 *  - Vertical wood veneer strip on the right
 *  - Long sleek vertical black handle
 *  - Small peephole
 */
@Injectable({ providedIn: 'root' })
export class DoorModelService {

  /** Create the full door group */
  createDoor(): THREE.Group {
    const doorGroup = new THREE.Group();

    // ----- Main Steel Panel -----
    const panelW = 1.6;
    const panelH = 2.8;
    const panelD = 0.06;

    const panelGeom = new THREE.BoxGeometry(panelW, panelH, panelD);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x5a6575,
      roughness: 0.55,
      metalness: 0.7,
    });
    const panel = new THREE.Mesh(panelGeom, panelMat);
    doorGroup.add(panel);

    // ----- Etched Geometric Polygon Lines -----
    // Shatter-style pattern on the left ~65% of the panel face
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x3a4555,
      linewidth: 1,
    });

    const etchPoints: [number, number, number, number][] = [
      // Format: [x1, y1, x2, y2] — all relative to panel center
      // Large angular shatter lines
      [-0.78, -1.38, -0.05,  0.60],
      [-0.78,  0.40,  0.15, -1.38],
      [-0.78, -0.50,  0.25,  1.38],
      [-0.50,  1.38,  0.20, -0.80],
      [-0.78,  1.00,  0.30,  0.10],
      [-0.20, -1.38,  0.15,  1.00],
      [-0.78, -1.00,  0.10,  0.30],
      [-0.60,  0.80,  0.30, -1.38],
      [-0.78,  1.38,  0.30, -0.30],
      [-0.40, -1.38, -0.10,  1.38],
      [ 0.00,  1.38,  0.30, -0.60],
      [-0.78, -0.10,  0.20,  1.38],
    ];

    const frontZ = panelD / 2 + 0.001;
    etchPoints.forEach(([x1, y1, x2, y2]) => {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y1, frontZ),
        new THREE.Vector3(x2, y2, frontZ),
      ]);
      const line = new THREE.Line(geom, linesMat);
      doorGroup.add(line);
    });

    // ----- Wood Veneer Strip (right side) -----
    const stripW = 0.45;
    const stripH = panelH - 0.02;
    const stripD = 0.015;
    const stripGeom = new THREE.BoxGeometry(stripW, stripH, stripD);
    const stripMat = new THREE.MeshStandardMaterial({
      color: 0x8B5A2B,
      roughness: 0.75,
      metalness: 0.05,
    });
    const strip = new THREE.Mesh(stripGeom, stripMat);
    strip.position.set(panelW / 2 - stripW / 2 - 0.02, 0, panelD / 2 + stripD / 2);
    doorGroup.add(strip);

    // Wood grain lines (subtle)
    const grainMat = new THREE.LineBasicMaterial({
      color: 0x6B3A1A,
      linewidth: 1,
      transparent: true,
      opacity: 0.35,
    });
    for (let i = 0; i < 12; i++) {
      const xOff = strip.position.x + (Math.random() - 0.5) * stripW * 0.7;
      const yStart = -stripH / 2 + Math.random() * 0.3;
      const yEnd = yStart + 0.8 + Math.random() * 1.2;
      const grainGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xOff, yStart, strip.position.z + stripD / 2 + 0.001),
        new THREE.Vector3(xOff + (Math.random() - 0.5) * 0.02, yEnd, strip.position.z + stripD / 2 + 0.001),
      ]);
      doorGroup.add(new THREE.Line(grainGeom, grainMat));
    }

    // ----- Vertical Black Handle -----
    const handleH = 0.65;
    const handleW = 0.025;
    const handleD = 0.03;
    const handleGeom = new THREE.BoxGeometry(handleW, handleH, handleD);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.9,
    });
    const handle = new THREE.Mesh(handleGeom, handleMat);
    handle.position.set(
      strip.position.x - stripW / 2 - 0.06,
      -0.15,
      panelD / 2 + 0.04
    );
    doorGroup.add(handle);

    // Handle bracket top
    const bracketGeom = new THREE.BoxGeometry(0.04, 0.04, 0.04);
    const bracketTop = new THREE.Mesh(bracketGeom, handleMat);
    bracketTop.position.set(
      handle.position.x,
      handle.position.y + handleH / 2,
      handle.position.z - 0.01
    );
    doorGroup.add(bracketTop);

    // Handle bracket bottom
    const bracketBottom = new THREE.Mesh(bracketGeom, handleMat);
    bracketBottom.position.set(
      handle.position.x,
      handle.position.y - handleH / 2,
      handle.position.z - 0.01
    );
    doorGroup.add(bracketBottom);

    // ----- Peephole -----
    const peepholeGeom = new THREE.SphereGeometry(0.02, 16, 16);
    const peepholeMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.2,
      metalness: 0.95,
    });
    const peephole = new THREE.Mesh(peepholeGeom, peepholeMat);
    peephole.position.set(
      handle.position.x,
      0.55,
      panelD / 2 + 0.02
    );
    doorGroup.add(peephole);

    // ----- Door Frame -----
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x3a3f4a,
      roughness: 0.6,
      metalness: 0.8,
    });
    const frameThickness = 0.08;
    const frameDepth = 0.1;

    // Top frame
    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(panelW + frameThickness * 2, frameThickness, frameDepth),
      frameMat
    );
    topFrame.position.set(0, panelH / 2 + frameThickness / 2, 0);
    doorGroup.add(topFrame);

    // Bottom frame
    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(panelW + frameThickness * 2, frameThickness, frameDepth),
      frameMat
    );
    bottomFrame.position.set(0, -panelH / 2 - frameThickness / 2, 0);
    doorGroup.add(bottomFrame);

    // Left frame
    const leftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, panelH + frameThickness * 2, frameDepth),
      frameMat
    );
    leftFrame.position.set(-panelW / 2 - frameThickness / 2, 0, 0);
    doorGroup.add(leftFrame);

    // Right frame
    const rightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(frameThickness, panelH + frameThickness * 2, frameDepth),
      frameMat
    );
    rightFrame.position.set(panelW / 2 + frameThickness / 2, 0, 0);
    doorGroup.add(rightFrame);

    // Scale down slightly so it fits nicely in the viewport
    doorGroup.scale.setScalar(0.85);

    return doorGroup;
  }
}
