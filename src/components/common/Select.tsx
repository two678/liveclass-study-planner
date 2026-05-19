import { useState } from 'react';
import Image from 'next/image';

/**
 * 공통 드롭다운 컴포넌트
 */
interface Option {
  value: string;
  label: string;
  color?: string;
}

/**
 * 선택지 내용
 * value : 선택된 값
 * onChange: 값 변경 시 호출
 * options: 선택지 배열
 * placeholder: placeholder 텍스트
 */
interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label: 'StartTime' | 'EndTime' | 'Day' | 'Course';
}

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectOption = options.find((opt) => opt.value === value);

  const labelMap: Record<'StartTime' | 'EndTime' | 'Day' | 'Course', string> = {
    StartTime: '시작 시간',
    EndTime: '종료 시간',
    Day: '요일',
    Course: '강의 선택',
  };

  return (
    <div className="relative w-full">
      {/* 드롭다운 레이블 */}
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {labelMap[label]}
      </label>
      {/* 현재 선택된 값 표시 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 border rounded-md"
      >
        {selectOption ? (
          <div className="flex items-center gap-2">
            {selectOption.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectOption.color }}
              />
            )}
            <span>{selectOption.label}</span>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span>
          {isOpen ? (
            <Image src="/ChevronUpIcon.svg" alt="Up" width={16} height={16} />
          ) : (
            <Image
              src="/ChevronDownIcon.svg"
              alt="Down"
              width={16}
              height={16}
            />
          )}
        </span>
      </button>
      {/* 드롭다운 옵션 목록 */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              {opt.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />
              )}
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
