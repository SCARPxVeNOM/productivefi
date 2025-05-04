import { redirect } from 'next/navigation';

export default function ExplorePage() {
  redirect('/tokenized-engagement-dashboard');
  
  // The code below won't run because of the redirect
  return null;
} 