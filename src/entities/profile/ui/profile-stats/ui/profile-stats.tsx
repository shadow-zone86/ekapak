'use client';

import { useAppSelector } from '@/shared/config/store-hooks';
import { Card, CardHeader, CardBody } from '@/shared/ui/card';
import { H3, PText, Description } from '@/shared/ui/typography';

export function ProfileStats() {
  const favoriteItemsCount = useAppSelector((state) => state.favorites.productUuids.length);

  return (
    <Card className="profile-stats">
      <CardHeader>
        <H3 className="profile-stats__title text-black text-lg font-bold">Статистика</H3>
      </CardHeader>
      <CardBody>
        <div className="profile-stats__content space-y-4">
          <div className="profile-stat-item flex items-center justify-between">
            <Description className="profile-stat-item__label text-gray-600 text-sm">Всего заказов</Description>
            <PText className="profile-stat-item__value text-black font-semibold">12</PText>
          </div>
          <div className="profile-stat-item flex items-center justify-between">
            <Description className="profile-stat-item__label text-gray-600 text-sm">На сумму</Description>
            <PText className="profile-stat-item__value text-black font-semibold">1 234 567 ₽</PText>
          </div>
          <div className="profile-stat-item flex items-center justify-between">
            <Description className="profile-stat-item__label text-gray-600 text-sm">В избранном</Description>
            <PText className="profile-stat-item__value text-black font-semibold">{favoriteItemsCount} товаров</PText>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
