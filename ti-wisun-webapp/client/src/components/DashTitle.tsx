import {Children, ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Color, ColorScheme, THEME, ThemeContext} from '../ColorScheme';
import {useSize} from '../hooks/useSize';
import {ComponentThemeImplementations} from '../utils';
import {HamburgerIcon} from './HamburgerIcon';

interface DashTitleTheme {
  backgroundColor?: Color;
  menuBackgroundColor?: Color;
  menuTextColor?: Color;
}

function RowSeparator() {
  return (
    <div
      style={{width: '40%', height: 1, marginTop: 5, marginBottom: 5, backgroundColor: 'white'}}
    />
  );
}

const dashTitleThemeImplementations = new ComponentThemeImplementations<DashTitleTheme>();

const tiDashTitleTheme = {
  backgroundColor: ColorScheme.getColor('red', THEME.TI),
  menuBackgroundColor: ColorScheme.getColor('white', THEME.TI),
  menuTextColor: ColorScheme.getColor('grayDark', THEME.TI),
};
dashTitleThemeImplementations.set(THEME.TI, tiDashTitleTheme);

const gruvboxDashTitleTheme = { 
  backgroundColor: ColorScheme.getColor('bg2', THEME.GRUVBOX),
  menuBackgroundColor: ColorScheme.getColor('bg3', THEME.GRUVBOX),
  menuTextColor: ColorScheme.getColor('white', THEME.GRUVBOX),
};
dashTitleThemeImplementations.set(THEME.GRUVBOX, gruvboxDashTitleTheme);

export function DashTitle({children}: {children: ReactNode}) {
  const theme = useContext(ThemeContext);
  const {backgroundColor, menuBackgroundColor, menuTextColor} = dashTitleThemeImplementations.get(theme);

  const target = useRef<HTMLDivElement>(null);
  const size = useSize(target);
  const [isHamburgerEnabled, setHamburgerEnabled] = useState(false);
  const width = size !== null ? size.width : 1600;
  const isCondensed = width < 980;
  useEffect(() => {
    if (!isCondensed) {
      setHamburgerEnabled(false);
    }
  }, [isHamburgerEnabled, isCondensed]);
  const toggleHamburger = useCallback(() => {
    setHamburgerEnabled(isHamburgerEnabled => !isHamburgerEnabled);
  }, []);

  const condensedContainerStyle = {
    display: 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'min(12vw,80px)',
  };
  const expandedContainerStyle = {
    display: 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 80,
  };
  const containerStyle = isCondensed ? condensedContainerStyle : expandedContainerStyle;

  const condensedHeaderStyle = {
    fontSize: 'min(7vw,46px)',
    margin: 0,
  };

  const expandedHeaderStyle = {
    fontSize: 46,
    marginLeft: '4.1667vw',
  };
  const headerStyle = isCondensed ? condensedHeaderStyle : expandedHeaderStyle;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 20,
      }}
    >
      <div
        ref={target}
        style={{
          ...containerStyle,
          backgroundColor,
        }}
      >
        {isCondensed && (
          <HamburgerIcon
            onClick={toggleHamburger}
            enabled={isHamburgerEnabled}
            style={{width: '8vw', position: 'absolute', left: '2vw'}}
          />
        )}
        <h1
          style={{
            fontWeight: 400,
            ...headerStyle,
          }}
        >
          Your Wi-SUN Network
        </h1>
      </div>
      
        {!isCondensed && (
          <div
            style={{
              width: '100%',
              color: menuTextColor,
              backgroundColor: menuBackgroundColor,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'end',
              padding: '0',
            }}
          >
            {children}
          </div>
        )}

      {isCondensed && isHamburgerEnabled && (
        <div
          style={{
            width: '100%',
            color: menuTextColor,
            backgroundColor: menuBackgroundColor,
            paddingTop: 20,
            paddingBottom: 20,
            rowGap: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {Children.map(children, (child, index) => {
            return (
              <>
                {index !== 0 && <RowSeparator />}
                {child}
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
