'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/shared/ui/card';
import { H3 } from '@/shared/ui/typography';
import { Button } from '@/shared/ui/button';

export function ProfileQuickActions() {
  return (
    <Card className="profile-actions">
      <CardHeader>
        <H3 className="profile-actions__title text-black text-lg font-bold">Быстрые действия</H3>
      </CardHeader>
      <CardBody>
        <div className="profile-actions__content space-y-3">
          <Link href="/cart" className="block">
            <Button variant="outline" className="w-full justify-start">
              Корзина
            </Button>
          </Link>
          <Link href="/favorites" className="block">
            <Button variant="outline" className="w-full justify-start">
              Избранное
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
