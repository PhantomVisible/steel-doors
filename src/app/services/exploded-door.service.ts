import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface ExplodedDoorParts {
  group: THREE.Group;
  backPanel: THREE.Group;
  skeleton: THREE.Group;
  insulation: THREE.Mesh;
  frontPanel: THREE.Group;
}

@Injectable({ providedIn: 'root' })
export class ExplodedDoorService {

  createExplodedDoor(): ExplodedDoorParts {
    const doorGroup = new THREE.Group();

    const panelW = 1.6;
    const panelH = 2.8;
    const layerDepth = 0.02;

    // ----- Common Materials -----
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x5a6575,
      roughness: 0.55,
      metalness: 0.7,
    });
    const skeletonMat = new THREE.MeshStandardMaterial({
      color: 0x2a2f35, // darker robust steel
      roughness: 0.7,
      metalness: 0.8,
    });
    const insulationMat = new THREE.MeshStandardMaterial({
      color: 0xdcd0a8, // yellowish/grey foam core
      roughness: 0.9,
      metalness: 0.1,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x8B5A2B,
      roughness: 0.75,
      metalness: 0.05,
    });

    // ----- Layer 1: Back Panel (Steel + Wood Strip) -----
    const backPanel = new THREE.Group();
    const backBase = new THREE.Mesh(new THREE.BoxGeometry(panelW, panelH, layerDepth), steelMat);
    backPanel.add(backBase);
    
    // Wood strip on back
    const stripW = 0.45;
    const stripH = panelH - 0.02;
    const stripD = layerDepth + 0.005;
    const backWood = new THREE.Mesh(new THREE.BoxGeometry(stripW, stripH, stripD), woodMat);
    backWood.position.set(-panelW / 2 + stripW / 2 + 0.02, 0, 0);
    backPanel.add(backWood);
    doorGroup.add(backPanel);

    // ----- Layer 2: Steel Skeleton (1.5-2mm look) -----
    const skeleton = new THREE.Group();
    const skelThickness = 0.04;
    const skelDepth = 0.04;
    // Outer frame
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(panelW, skelThickness, skelDepth), skeletonMat);
    topFrame.position.y = panelH / 2 - skelThickness / 2;
    skeleton.add(topFrame);
    
    const botFrame = new THREE.Mesh(new THREE.BoxGeometry(panelW, skelThickness, skelDepth), skeletonMat);
    botFrame.position.y = -panelH / 2 + skelThickness / 2;
    skeleton.add(botFrame);
    
    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(skelThickness, panelH, skelDepth), skeletonMat);
    leftFrame.position.x = -panelW / 2 + skelThickness / 2;
    skeleton.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(skelThickness, panelH, skelDepth), skeletonMat);
    rightFrame.position.x = panelW / 2 - skelThickness / 2;
    skeleton.add(rightFrame);

    // Inner crossbars
    for (let i = 1; i <= 3; i++) {
        const crossY = (panelH / 4) * i - (panelH / 2);
        const crossBar = new THREE.Mesh(new THREE.BoxGeometry(panelW - skelThickness * 2, skelThickness, skelDepth), skeletonMat);
        crossBar.position.y = crossY;
        skeleton.add(crossBar);
    }
    // Middle vertical bar
    const midBar = new THREE.Mesh(new THREE.BoxGeometry(skelThickness, panelH - skelThickness * 2, skelDepth), skeletonMat);
    skeleton.add(midBar);
    
    doorGroup.add(skeleton);

    // ----- Layer 3: Insulation (Foam core blocks) -----
    const insulationGeom = new THREE.BoxGeometry(panelW - skelThickness * 2, panelH - skelThickness * 2, skelDepth - 0.005);
    const insulation = new THREE.Mesh(insulationGeom, insulationMat);
    // Push it slightly back to avoid z-fighting with skeleton
    insulation.position.set(0, 0, 0);
    doorGroup.add(insulation);

    // ----- Layer 4: Front Panel (Steel + Wood Strip + Handle) -----
    const frontPanel = new THREE.Group();
    const frontBase = new THREE.Mesh(new THREE.BoxGeometry(panelW, panelH, layerDepth), steelMat);
    frontPanel.add(frontBase);
    
    // Wood strip on front
    const frontWood = new THREE.Mesh(new THREE.BoxGeometry(stripW, stripH, stripD), woodMat);
    frontWood.position.set(panelW / 2 - stripW / 2 - 0.02, 0, 0);
    frontPanel.add(frontWood);

    // Handle on front
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.9,
    });
    const handleH = 0.65;
    const handleW = 0.025;
    const handleD = 0.03;
    const handle = new THREE.Mesh(new THREE.BoxGeometry(handleW, handleH, handleD), handleMat);
    const hardwareX = frontWood.position.x - stripW / 2 - 0.06;
    handle.position.set(hardwareX, -0.15, layerDepth / 2 + handleD / 2 + 0.02);
    frontPanel.add(handle);
    
    const bracketTop = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), handleMat);
    bracketTop.position.set(handle.position.x, handle.position.y + handleH / 2, layerDepth / 2 + 0.02);
    frontPanel.add(bracketTop);
    
    const bracketBot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), handleMat);
    bracketBot.position.set(handle.position.x, handle.position.y - handleH / 2, layerDepth / 2 + 0.02);
    frontPanel.add(bracketBot);

    doorGroup.add(frontPanel);

    // Distribute them initially for the exploded view
    // We space them out significantly on the Z axis
    const spacing = 0.4;
    backPanel.position.z = -spacing * 1.5;
    insulation.position.z = -spacing * 0.5;
    skeleton.position.z = spacing * 0.5;
    frontPanel.position.z = spacing * 1.5;

    // Scale everything down a bit
    doorGroup.scale.setScalar(0.7);

    // Angle it so the layers are visible
    doorGroup.rotation.y = Math.PI / 4;

    return {
      group: doorGroup,
      backPanel,
      skeleton,
      insulation,
      frontPanel
    };
  }
}
