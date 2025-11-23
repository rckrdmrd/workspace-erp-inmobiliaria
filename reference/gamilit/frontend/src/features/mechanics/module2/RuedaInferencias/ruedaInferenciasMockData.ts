export const mockInferenceWheel = {
  id: 'wheel-1',
  centralText: 'Marie Curie descubrió elementos radiactivos',
  nodes: [
    { id: 'n1', text: 'Trabajó sin protección', evidence: ['Lab notes', 'Photos'], confidence: 0.9, position: { x: 100, y: 0 } },
    { id: 'n2', text: 'Desarrollo síntomas', evidence: ['Medical records'], confidence: 0.85, position: { x: 0, y: 100 } },
    { id: 'n3', text: 'Premio Nobel', evidence: ['Historical records'], confidence: 1.0, position: { x: -100, y: 0 } },
  ],
  connections: [],
};
