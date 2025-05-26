import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group/RadioGroup';
import { Text } from 'src/ui/text/Text';

import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
  ArticleStateType,
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';

// Добавляем тип для пропсов
type ArticleParamsFormProps = {
  // isOpen: boolean;
  // onToggle: () => void;
  // onClose: () => void;
  currentArticleState: ArticleStateType;
  setCurrentArticleState: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  currentArticleState,
  setCurrentArticleState,
}: ArticleParamsFormProps) => {
  // Локальное состояние для редактирования
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSettings, setLocalSettings] =
    useState<ArticleStateType>(currentArticleState);

  // Сброс локального состояния при открытии
  useEffect(() => {
    setLocalSettings(currentArticleState);
  }, [currentArticleState]);

  //обработка 'Escape'
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc); //не забываем ремувить за собой
    };
  }, []);

  //долгая попытка настройки оверлея...ааа
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const container = document.querySelector(`.${styles.container}`);
      if (container && !container.contains(mouseEvent.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const overlay = document.querySelector(`.${styles.overlay}`);
    if (overlay) {
      overlay.addEventListener('click', handleClick);
    }

    return () => {
      if (overlay) {
        overlay.removeEventListener('click', handleClick);
      }
    };
  }, [isMenuOpen]);
  // Универсальный обработчик
  // (функция, которая обновляет любую часть коробки с настроками)
  const updateLocal =
    <K extends keyof ArticleStateType>(key: K) =>
    (value: ArticleStateType[K]) => {
      setLocalSettings((prev) => ({ ...prev, [key]: value }));
    };

  const handleApply = () => {
    setCurrentArticleState(localSettings);
    setIsMenuOpen(false);
  };

  const handleReset = () => {
    setLocalSettings(defaultArticleState);
    setCurrentArticleState(defaultArticleState);
    setIsMenuOpen(false);
  };
  return (
    <>
      {/* Стрелка-кнопка управляет состоянием меню */}
      <ArrowButton
        isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      <div className={styles.overlay}>
        <aside
          className={clsx(styles.container, {
            [styles.container_open]: isMenuOpen,
          })}
          onClick={(e) => e.stopPropagation()}>
          {/* предотвращает закрытие при клике по aside */}

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault(); // предотвращает обновление при клике по кнопке
              handleApply(); //обработка submit перенесена на form
            }}>
            {/* настройки */}
            <Text size={31} weight={800} family='open-sans' uppercase>
              Задайте параметры
            </Text>

            <Select
              selected={localSettings.fontFamilyOption}
              onChange={updateLocal('fontFamilyOption')}
              options={fontFamilyOptions}
              title='Шрифт'
            />

            <RadioGroup
              selected={localSettings.fontSizeOption}
              onChange={updateLocal('fontSizeOption')}
              options={fontSizeOptions}
              title='Размер шрифта'
              name='font-size'
            />

            <Select
              selected={localSettings.fontColor}
              onChange={updateLocal('fontColor')}
              options={fontColors}
              title='Цвет текста'
            />

            <Separator />

            <Select
              selected={localSettings.backgroundColor}
              onChange={updateLocal('backgroundColor')}
              options={backgroundColors}
              title='Цвет фона'
            />

            <Select
              selected={localSettings.contentWidth}
              onChange={updateLocal('contentWidth')}
              options={contentWidthArr}
              title='Ширина контента'
            />

            <div className={styles.bottomContainer}>
              <Button
                title='Сбросить'
                htmlType='reset'
                type='clear'
                onClick={handleReset}
              />
              <Button title='Применить' htmlType='submit' type='apply' />
            </div>
          </form>
        </aside>
      </div>
    </>
  );
};
