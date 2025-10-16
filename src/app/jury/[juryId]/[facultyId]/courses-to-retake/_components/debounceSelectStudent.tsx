import React, { useMemo, useState } from 'react';
import { Select, Spin, Avatar } from 'antd';
import type { SelectProps } from 'antd';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Enrollment } from '@/types';
import { getYearEnrollments } from '@/lib/api';
import { getHSLColor } from '@/lib/utils';

interface EnrollmentOption {
  label: string;
  value: number;
  avatar?: string;
  data: Enrollment;
}

interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  facultyId?: number;
  debounceTimeout?: number;
}

export function DebounceEnrollmentSelect({
  facultyId,
  debounceTimeout = 300,
  ...props
}: DebounceSelectProps<EnrollmentOption>) {
  const [search, setSearch] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((val: string) => setSearch(val), debounceTimeout),
    [debounceTimeout]
  );

  const { data, isFetching } = useQuery({
    queryKey: ['year-enrollments', facultyId, search],
    queryFn: async () => {
      const res = await getYearEnrollments({ facultyId, search });
      return res.results.map((enr) => ({
        label: `${enr.user.surname} ${enr.user.last_name} ${enr.user.first_name} - (${enr.class_year?.acronym} ${enr.academic_year?.name}) `,
        value: enr.id,
        avatar: enr.user.avatar,
        data: enr,
      }));
    },
    enabled: !!facultyId,
  });

  return (
    <Select
      showSearch
      labelInValue
      allowClear
      filterOption={false}
      onSearch={debouncedSearch}
      notFoundContent={isFetching ? <Spin size="small" /> : "Aucun résultat"}
      options={data ?? []}
      optionRender={(option) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {option.data.avatar && (
            <Avatar
              src={option.data.avatar}
              style={{
                marginRight: 8,
                background: getHSLColor(`${option.data.data.user.first_name}`),
              }}
            >
              {option.data.data.user.first_name?.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <span>{option.label}</span>
        </div>
      )}
      {...props}
    />
  );
}
