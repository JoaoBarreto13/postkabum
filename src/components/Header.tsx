import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-[0_1px_3px_0_rgb(0_0_0/0.02)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="h-[52px] flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 select-none">
            <div className="relative">
              <img 
                src={logoImg} 
                alt="Post it in Kabum" 
                className="w-7 h-7 rounded-[6px] shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.08]" 
              />
            </div>
            <span className="font-semibold text-[15px] tracking-[-0.01em] text-foreground/90">
              Post it in Kabum
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] active:bg-foreground/[0.06] transition-all duration-150"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Sun className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>

            {/* Separator */}
            {user && (
              <div className="w-px h-4 bg-border/60 mx-1.5" />
            )}

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 flex items-center gap-2 px-1.5 rounded-md hover:bg-foreground/[0.04] active:bg-foreground/[0.06] transition-all duration-150 outline-none">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/10">
                      <User className="w-3.5 h-3.5 text-primary/80" strokeWidth={1.75} />
                    </div>
                    <span className="hidden sm:inline text-[13px] font-medium text-foreground/75 max-w-[120px] truncate pr-1">
                      {user.email?.split('@')[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-52 rounded-lg shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
                  <div className="px-3 py-2.5 border-b border-border/50">
                    <p className="text-xs font-medium text-foreground/90 truncate">{user.email?.split('@')[0]}</p>
                    <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem 
                      onClick={() => signOut()} 
                      className="h-8 text-[13px] rounded-md text-destructive/80 focus:text-destructive focus:bg-destructive/[0.08] cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" strokeWidth={1.75} />
                      Sair
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
