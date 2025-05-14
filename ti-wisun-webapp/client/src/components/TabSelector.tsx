import '../assets/TabSelector.css';
import { useContext } from 'react';
import {Color, ColorScheme, THEME, ThemeContext} from '../ColorScheme';
import {ComponentThemeImplementations} from '../utils';

interface TabSelectorProps {
  name: string;
  isSelected: boolean;
  selectTab: () => void;
}

interface TabSelectorTheme {
  selectedColor?: Color;
}

const dashTitleThemeImplementations = new ComponentThemeImplementations<TabSelectorTheme>();

const tiTabSelectorTheme = {
  selectedColor: ColorScheme.getColor('hoverLightGray', THEME.TI),
};
dashTitleThemeImplementations.set(THEME.TI, tiTabSelectorTheme);

const gruvboxTabSelectorTheme = { 
  selectedColor: ColorScheme.getColor('bg2', THEME.GRUVBOX),
};
dashTitleThemeImplementations.set(THEME.GRUVBOX, gruvboxTabSelectorTheme);

export default function TabSelector(props: TabSelectorProps) {
  const theme = useContext(ThemeContext);
  const {selectedColor} = dashTitleThemeImplementations.get(theme);

  return (
    <h3
      className="tab_selector"
      style={{fontSize: 24, fontWeight: 400, backgroundColor: props.isSelected ? selectedColor : 'rgba(0,0,0,0)'}}
      onClick={() => props.selectTab()}
    >
      {props.name}
    </h3>
  );
}
