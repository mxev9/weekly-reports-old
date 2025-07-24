import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useScheduleStore } from '@/hooks/useScheduleStore';
import { useTranslation } from '@/hooks/useTranslation';

export function ScheduleActions() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { resetSchedule } = useScheduleStore();
  const { t } = useTranslation();

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    
    resetSchedule();
    setResetDialogOpen(false);
    setConfirmReset(false);
  };

  const handleCloseDialog = () => {
    setResetDialogOpen(false);
    setConfirmReset(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold mb-4">Actions</h3>
      
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" className="gap-2 w-full">
            <RotateCcw className="h-4 w-4" />
            {t('resetSchedule')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('confirmReset')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('confirmResetMessage')}
            </p>
            
            {confirmReset && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Click "Confirm Reset" again to permanently delete all data
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                {t('cancel')}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReset}
                className={confirmReset ? 'bg-destructive hover:bg-destructive/90' : ''}
              >
                {confirmReset ? 'Confirm Reset' : t('confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}