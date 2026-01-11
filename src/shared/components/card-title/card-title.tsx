interface CardTitleProps {
  name: string;
}

export function CardTitle({ name }: CardTitleProps) {
  return (
    <h3 className="mb-2.5 line-clamp-3 text-p-catalog text-black leading-tight text-sm">
      {name}
    </h3>
  );
}
