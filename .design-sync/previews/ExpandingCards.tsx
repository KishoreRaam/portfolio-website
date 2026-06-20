import { ExpandingCards } from '@figma/my-make-file';

// Placeholder colored rectangle as imgSrc (works offline in headless)
const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:%230f0f0f"/>';
const PLACEHOLDER_2 =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:%231a1a2e"/>';
const PLACEHOLDER_3 =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:%2316213e"/>';

const SAMPLE_ITEMS = [
  {
    id: 'project-1',
    title: 'StudentsHub',
    description: 'Centralized platform for students to discover resources, tools and opportunities.',
    imgSrc: PLACEHOLDER,
    icon: null,
    tag: 'React',
    year: '2024',
    url: '#',
  },
  {
    id: 'project-2',
    title: 'RoadSoS',
    description: 'Emergency roadside assistance platform connecting drivers with nearby help.',
    imgSrc: PLACEHOLDER_2,
    icon: null,
    tag: 'React Native',
    year: '2024',
    url: '#',
  },
  {
    id: 'project-3',
    title: 'BloodLink',
    description: 'Blood donation management system connecting donors with recipients in real-time.',
    imgSrc: PLACEHOLDER_3,
    icon: null,
    tag: 'Full Stack',
    year: '2023',
    url: '#',
  },
];

export function Default() {
  return (
    <div style={{ width: 900, height: 520, overflow: 'hidden' }}>
      <ExpandingCards items={SAMPLE_ITEMS} />
    </div>
  );
}
