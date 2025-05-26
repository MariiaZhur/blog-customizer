import { createRoot } from 'react-dom/client';
import { StrictMode, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
  ArticleStateType,
  defaultArticleState,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
  // const [isSidebarOpen, setSidebarOpen] = useState(false); // наше меню
  const [displaySettings, setDisplaySettings] =
    useState<ArticleStateType>(defaultArticleState); // глобальные стили

  return (
    <main
      className={clsx(styles.main)}
      style={
        {
          '--font-family': displaySettings.fontFamilyOption.value,
          '--font-size': displaySettings.fontSizeOption.value,
          '--font-color': displaySettings.fontColor.value,
          '--container-width': displaySettings.contentWidth.value,
          '--bg-color': displaySettings.backgroundColor.value,
        } as React.CSSProperties
      }>
      <ArticleParamsForm
        // isOpen={isSidebarOpen}
        // onToggle={() => setSidebarOpen(!isSidebarOpen)}
        // onClose={() => setSidebarOpen(false)}
        currentArticleState={displaySettings}
        setCurrentArticleState={setDisplaySettings}
      />
      <Article />
    </main>
  );
};

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
