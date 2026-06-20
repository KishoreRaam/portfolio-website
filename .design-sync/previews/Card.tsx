import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter, Button,
} from '@figma/my-make-file';

export function ProjectCard() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Portfolio Project</CardTitle>
        <CardDescription>A showcase of recent work</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Built with React and TypeScript. Features modern UI components and a
          responsive design system.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm">View Project</Button>
        <Button size="sm" variant="outline">Details</Button>
      </CardFooter>
    </Card>
  );
}

export function Minimal() {
  return (
    <Card className="w-72 p-4">
      <CardTitle className="text-base">Quick Note</CardTitle>
      <p className="mt-2 text-sm text-muted-foreground">
        A minimal card with just a title and content.
      </p>
    </Card>
  );
}

export function WithAction() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View All</Button>
      </CardFooter>
    </Card>
  );
}
