'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button size="icon" className="h-14 w-14 shadow-lg bg-primary">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
