import { Avatar, AvatarImage, AvatarFallback } from '@figma/my-make-file';

export function WithImage() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

export function WithFallback() {
  return (
    <Avatar>
      <AvatarFallback>KR</AvatarFallback>
    </Avatar>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar className="size-8">
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="size-14">
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>
    </div>
  );
}
