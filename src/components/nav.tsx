import { Link } from 'react-router-dom'
import { Button, buttonVariants } from './custom/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'

// todo add tooltip functionality back
import {
  // Tooltip,
  // TooltipContent,
  TooltipProvider,
  // TooltipTrigger,
} from './ui/tooltip'
import { cn } from '@/lib/utils'
import useCheckActiveNav from '@/hooks/use-check-active-nav'
import { SideLink } from '@/data/sidelinks'
import { Suspense, useEffect } from 'react'
import { useSidebar } from '@/hooks/use-sidebar'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import { LoadingSpinner } from './custom/loading-spinner'

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  links: SideLink[]
  closeNav: () => void
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

export default function Nav({
  links,
  isCollapsed,
  setIsCollapsed,
  closeNav,
  className,
}: NavProps) {
  const { currentContent, setCurrentContent } = useSidebar()

  useEffect(() => {
    if (isCollapsed) {
      setCurrentContent(null)
    }
  }, [isCollapsed, setCurrentContent])

  const renderLink = (link: SideLink) => {
    const key = `${link.title}`

    // if (isCollapsed && link.sub)
    //   return (
    //     <NavLinkIconDropdown
    //       {...link}
    //       sub={link.sub}
    //       key={key}
    //       closeNav={closeNav}
    //       setCurrentContent={setCurrentContent}
    //     />
    //   )

    if (isCollapsed) return;

    if (link.sub)
      return (
        <NavLinkDropdown
          {...link}
          key={key}
          closeNav={closeNav}
          setCurrentContent={setCurrentContent}
        />
      )

    return (
      <NavLink
        {...link}
        key={key}
        closeNav={closeNav}
        setCurrentContent={setCurrentContent}
      />
    )
  }

  const handleBackToMenu = () => {
    setCurrentContent(null)
  }

  const DynamicComponent = currentContent?.component
    ? currentContent?.component
    : null

  return (
    <div className="flex flex-1" >
      {/* Icons Column */}
      <div className="hidden md:flex flex-col items-center gap-4 p-2 border-r-2" >
        {
          links.map((link, index) => {
            if (link.href) {
              return (
                <Link
                  key={index}
                  to={link.href}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'icon',
                    }),
                    'transition-transform duration-200 ease-in-out'
                  )}
                >
                  {link.icon}
                </Link>
              )
            }
            return (

              <Button
                key={index}
                variant="ghost"
                size="icon"
                aria-label={link.title}
                className={`transition-transform duration-200 ease-in-out ${isCollapsed ? '' : 'rotate-0'}`}
                onClick={() => {
                  console.log(link.title);
                  setCurrentContent(link)

                  if (isCollapsed) {
                    setIsCollapsed(false)
                  }

                  if (!isCollapsed && currentContent?.title === link.title) {
                    setCurrentContent(null)
                    setIsCollapsed(true)
                  }
                }}
              >
                {link.icon}
              </Button>
            )
          })
        }
      </div >
      <div
        data-collapsed={isCollapsed}
        className={cn(
          'group border-b bg-background py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none',
          className
        )}
      >
        <TooltipProvider delayDuration={0}>
          {currentContent ? (
            <div className="px-4 pb-4 h-full">
              <Suspense fallback={<div><LoadingSpinner /></div>}>
                <Button onClick={handleBackToMenu} variant="ghost">
                  <ArrowLeft />&nbsp;Back to menu
                </Button>
                {DynamicComponent ? (
                  <div className='overflow-y-auto h-full'>
                    <DynamicComponent />
                  </div>
                ) : (
                  <div className='w-full flex justify-center'>
                    <LoadingSpinner />
                  </div>
                )}
              </Suspense>
            </div>
          ) : (
            <nav className='grid gap-4 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
              {links.map(renderLink)}
            </nav>
          )}
        </TooltipProvider>
      </div>
    </div >
  )
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
  closeNav: () => void
  isCollapsed?: boolean
  href?: string
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentContent: (content: SideLink) => void
}

function NavLink({
  title,
  icon,
  label,
  component,
  componentPath,
  href,
  // closeNav,
  subLink = false,
  setCurrentContent,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  const handleClick = () => {
    if (!href) {
      setCurrentContent({ title, icon, label, componentPath, component })
    }
  }

  const linkContent = (
    <>
      <div className='block md:hidden mr-2'>{icon}</div>
      {title}
      {label && (
        <div className='ml-2 rounded-lg bg-primary px-1 text-[0.75rem] text-primary-foreground'>
          {label}
        </div>
      )}
    </>
  )

  return href ? (
    <Link
      to={href}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: 'sm',
        }),
        'h-9 justify-start text-wrap rounded-none px-6',
        subLink && 'h-8 w-full border-l border-l-slate-500 px-2'
      )}
      aria-current={checkActiveNav(componentPath ?? '') ? 'page' : undefined}
    >
      {linkContent}
    </Link>
  ) : (
    <button
      onClick={handleClick}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: 'sm',
        }),
        'h-9 justify-start text-wrap rounded-none px-6',
        subLink && 'h-8 w-full border-l border-l-slate-500 px-2'
      )}
      aria-current={checkActiveNav(componentPath ?? '') ? 'page' : undefined}
    >
      {linkContent}
    </button>
  )
}

function NavLinkDropdown({
  title,
  icon,
  label,
  sub,
  closeNav,
  setCurrentContent,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  const isChildActive = !!sub?.find((s) => checkActiveNav(s.componentPath ?? ''))

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-12 w-full justify-start rounded-none px-6'
        )}
      >
        <div className='mr-2'>{icon}</div>
        {title}
        {label && (
          <div className='ml-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground'>
            {label}
          </div>
        )}
        <span
          className={cn(
            'ml-auto transition-all group-data-[state="open"]:-rotate-180'
          )}
        >
          <ChevronLeft />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {sub?.map((item) => (
          <NavLink
            key={item.componentPath}
            {...item}
            subLink
            closeNav={closeNav}
            setCurrentContent={setCurrentContent}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function NavLinkIcon({
  icon,
  title,
  componentPath,
  component,
  closeNav,
  setCurrentContent,
  isCollapsed,
  setIsCollapsed,
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  const handleClick = () => {
    setIsCollapsed && setIsCollapsed(!isCollapsed)
    setCurrentContent({ title, icon, componentPath, component })
    closeNav()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: 'sm',
        }),
        'h-12 w-12 justify-center rounded-none'
      )}
      aria-current={checkActiveNav(componentPath ?? '') ? 'page' : undefined}
    >
      {icon}
    </button>
  )
}


// function NavLinkIconDropdown({ title, icon, label, sub }: NavLinkProps) {
//   const { checkActiveNav } = useCheckActiveNav()

//   /* Open collapsible by default
//    * if one of child element is active */
//   const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))

//   return (
//     <DropdownMenu>
//       <Tooltip delayDuration={0}>
//         <TooltipTrigger asChild>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant={isChildActive ? 'secondary' : 'ghost'}
//               size='icon'
//               className='h-12 w-12'
//             >
//               {icon}
//             </Button>
//           </DropdownMenuTrigger>
//         </TooltipTrigger>
//         <TooltipContent side='right' className='flex items-center gap-4'>
//           {title}{' '}
//           {label && (
//             <span className='ml-auto text-muted-foreground'>{label}</span>
//           )}
//           <IconChevronDown
//             size={18}
//             className='-rotate-90 text-muted-foreground'
//           />
//         </TooltipContent>
//       </Tooltip>
//       <DropdownMenuContent side='right' align='start' sideOffset={4}>
//         <DropdownMenuLabel>
//           {title} {label ? `(${label})` : ''}
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         {sub!.map(({ title, icon, label, href }) => (
//           <DropdownMenuItem key={`${title}-${href}`} asChild>
//             <Link
//               to={href}
//               className={`${checkActiveNav(href) ? 'bg-secondary' : ''}`}
//             >
//               {icon} <span className='ml-2 max-w-52 text-wrap'>{title}</span>
//               {label && <span className='ml-auto text-xs'>{label}</span>}
//             </Link>
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
