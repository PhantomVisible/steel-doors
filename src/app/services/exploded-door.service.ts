import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface ExplodedDoorParts {
  group: THREE.Group;
  layer1_backWood: THREE.Group;
  layer2_backFoam: THREE.Mesh;
  layer3_skeleton: THREE.Group;
  layer4_frontFoam: THREE.Mesh;
  layer5_frontWood: THREE.Group;
  anchors: {
    backWood: THREE.Object3D;
    backFoam: THREE.Object3D;
    skeleton: THREE.Object3D;
    frontFoam: THREE.Object3D;
    frontWood: THREE.Object3D;
  };
}

@Injectable({ providedIn: 'root' })
export class ExplodedDoorService {

  createExplodedDoor(): ExplodedDoorParts {
    const doorGroup = new THREE.Group();

    const panelW = 1.6;
    const panelH = 2.8;
    // Total thickness of door is approx 0.12, each layer gets a slice
    const woodThickness = 0.015;
    const foamThickness = 0.025;
    const skelThickness = 0.04;

    // ----- Common Materials -----
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x3a4555,
      roughness: 0.5,
      metalness: 0.8,
    });
    const skeletonMat = new THREE.MeshStandardMaterial({
      color: 0x9ba4b5, // Lighter metallic grey for the inner skeleton
      roughness: 0.4,
      metalness: 0.9,
    });
    const insulationMat = new THREE.MeshStandardMaterial({
      color: 0xe8e5da, // Off-white dense foam
      roughness: 0.9,
      metalness: 0.05,
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x2c2622, // Dark modern wood finish
      roughness: 0.8,
      metalness: 0.1,
    });
    const woodStripMat = new THREE.MeshStandardMaterial({
      color: 0x8B5A2B,
      roughness: 0.75,
      metalness: 0.05,
    });

    // Helper to create an anchor
    const createAnchor = (x: number, y: number, z: number, parent: THREE.Group | THREE.Mesh) => {
      const anchor = new THREE.Object3D();
      anchor.position.set(x, y, z);
      parent.add(anchor);
      return anchor;
    };

    // ----- Layer 1: Back Wood Board -----
    const layer1_backWood = new THREE.Group();
    const backWoodBase = new THREE.Mesh(new THREE.BoxGeometry(panelW, panelH, woodThickness), darkWoodMat);
    layer1_backWood.add(backWoodBase);
    
    // Add some subtle vertical lines to the wood
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1a1512, transparent: true, opacity: 0.5 });
    for(let i=1; i<5; i++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-panelW/2 + (panelW/5)*i, -panelH/2 + 0.1, woodThickness/2 + 0.001),
            new THREE.Vector3(-panelW/2 + (panelW/5)*i, panelH/2 - 0.1, woodThickness/2 + 0.001)
        ]);
        layer1_backWood.add(new THREE.Line(lineGeo, lineMat));
    }
    const anchorBackWood = createAnchor(-panelW/2 + 0.2, panelH/4, 0, layer1_backWood);
    doorGroup.add(layer1_backWood);


    // ----- Layer 2: Back Insulation Foam -----
    const backFoamGeom = new THREE.BoxGeometry(panelW - 0.02, panelH - 0.02, foamThickness);
    const layer2_backFoam = new THREE.Mesh(backFoamGeom, insulationMat);
    const anchorBackFoam = createAnchor(-panelW/2 + 0.4, 0, 0, layer2_backFoam);
    doorGroup.add(layer2_backFoam);


    // ----- Layer 3: Stainless Steel Skeleton -----
    const layer3_skeleton = new THREE.Group();
    // Outer frame
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(panelW, skelThickness, skelThickness), skeletonMat);
    topFrame.position.y = panelH / 2 - skelThickness / 2;
    layer3_skeleton.add(topFrame);
    
    const botFrame = new THREE.Mesh(new THREE.BoxGeometry(panelW, skelThickness, skelThickness), skeletonMat);
    botFrame.position.y = -panelH / 2 + skelThickness / 2;
    layer3_skeleton.add(botFrame);
    
    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(skelThickness, panelH, skelThickness), skeletonMat);
    leftFrame.position.x = -panelW / 2 + skelThickness / 2;
    layer3_skeleton.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(skelThickness, panelH, skelThickness), skeletonMat);
    rightFrame.position.x = panelW / 2 - skelThickness / 2;
    layer3_skeleton.add(rightFrame);

    // 3x3 Layout (2 vertical, 2 horizontal inner bars)
    const crossBarMat = skeletonMat;
    const vBarGeom = new THREE.BoxGeometry(0.04, panelH, skelThickness-0.01);
    const hBarGeom = new THREE.BoxGeometry(panelW, 0.04, skelThickness-0.01);
    
    // Vertical inner bars
    const vBar1 = new THREE.Mesh(vBarGeom, crossBarMat);
    vBar1.position.x = -panelW / 6;
    layer3_skeleton.add(vBar1);
    
    const vBar2 = new THREE.Mesh(vBarGeom, crossBarMat);
    vBar2.position.x = panelW / 6;
    layer3_skeleton.add(vBar2);

    // Horizontal inner bars
    const hBar1 = new THREE.Mesh(hBarGeom, crossBarMat);
    hBar1.position.y = -panelH / 6;
    layer3_skeleton.add(hBar1);

    const hBar2 = new THREE.Mesh(hBarGeom, crossBarMat);
    hBar2.position.y = panelH / 6;
    layer3_skeleton.add(hBar2);

    const anchorSkeleton = createAnchor(0, panelH/3, 0, layer3_skeleton);
    doorGroup.add(layer3_skeleton);


    // ----- Layer 4: Front Insulation Foam -----
    const frontFoamGeom = new THREE.BoxGeometry(panelW - 0.02, panelH - 0.02, foamThickness);
    const layer4_frontFoam = new THREE.Mesh(frontFoamGeom, insulationMat);
    const anchorFrontFoam = createAnchor(panelW/2 - 0.4, -0.1, 0, layer4_frontFoam);
    doorGroup.add(layer4_frontFoam);


    // ----- Layer 5: Front Panel (Hero Style) -----
    const layer5_frontWood = new THREE.Group();
    
    const heroPanelMat = new THREE.MeshStandardMaterial({
      color: 0x5a6575,
      roughness: 0.55,
      metalness: 0.7,
    });
    const frontWoodBase = new THREE.Mesh(new THREE.BoxGeometry(panelW, panelH, woodThickness), heroPanelMat);
    layer5_frontWood.add(frontWoodBase);
    
    // Etched Geometric Polygon Lines (from Hero model)
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x3a4555,
      linewidth: 1,
    });
    const etchPoints: [number, number, number, number][] = [
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

    const frontZ = woodThickness / 2 + 0.001;
    etchPoints.forEach(([x1, y1, x2, y2]) => {
      const frontGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y1, frontZ),
        new THREE.Vector3(x2, y2, frontZ),
      ]);
      layer5_frontWood.add(new THREE.Line(frontGeom, linesMat));
    });
    
    // Wood strip on right side
    const stripW = 0.45;
    const stripH = panelH - 0.02;
    const stripD = woodThickness + 0.005;
    const frontWoodStrip = new THREE.Mesh(new THREE.BoxGeometry(stripW, stripH, stripD), woodStripMat);
    frontWoodStrip.position.set(panelW / 2 - stripW / 2 - 0.02, 0, 0);
    layer5_frontWood.add(frontWoodStrip);

    // Handle
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.9,
    });
    const handleH = 0.65;
    const handleW = 0.025;
    const handleD = 0.04;
    const handle = new THREE.Mesh(new THREE.BoxGeometry(handleW, handleH, handleD), handleMat);
    const hardwareX = frontWoodStrip.position.x - stripW / 2 - 0.08;
    handle.position.set(hardwareX, -0.15, woodThickness / 2 + handleD / 2 + 0.02);
    layer5_frontWood.add(handle);
    
    const bracketTop = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), handleMat);
    bracketTop.position.set(handle.position.x, handle.position.y + handleH / 2, woodThickness / 2 + 0.02);
    layer5_frontWood.add(bracketTop);
    
    const bracketBot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), handleMat);
    bracketBot.position.set(handle.position.x, handle.position.y - handleH / 2, woodThickness / 2 + 0.02);
    layer5_frontWood.add(bracketBot);

    const anchorFrontWood = createAnchor(panelW/2 - 0.2, -panelH/4, woodThickness/2, layer5_frontWood);
    doorGroup.add(layer5_frontWood);

    // ----- Distribute spacing for exploded view -----
    const spacing = 0.35;
    layer1_backWood.position.z = -spacing * 2;
    layer2_backFoam.position.z = -spacing * 1;
    layer3_skeleton.position.z = 0;
    layer4_frontFoam.position.z = spacing * 1;
    layer5_frontWood.position.z = spacing * 2;

    // Scale and angle
    doorGroup.scale.setScalar(1.1);
    doorGroup.rotation.y = Math.PI / 4 + 0.1;

    return {
      group: doorGroup,
      layer1_backWood,
      layer2_backFoam,
      layer3_skeleton,
      layer4_frontFoam,
      layer5_frontWood,
      anchors: {
        backWood: anchorBackWood,
        backFoam: anchorBackFoam,
        skeleton: anchorSkeleton,
        frontFoam: anchorFrontFoam,
        frontWood: anchorFrontWood
      }
    };
  }
}
