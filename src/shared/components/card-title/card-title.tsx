interface CardTitleProps {
  name: string;
}

export function CardTitle({ name }: CardTitleProps) {
  return (
    <h3 className="card-title mb-2.5 line-clamp-3 text-p-catalog text-black leading-tight text-sm">
      {name}
    </h3>
  );
}
