/*
Language: C++
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Contributors: Evgeny Stepanischev <imbolk@gmail.com>, Zaven Muradyan <megalivoithos@gmail.com>, Roel Deckers <admin@codingcat.nl>, Sam Wu <samsam2310@gmail.com>, Jordi Petit <jordi.petit@gmail.com>, Pieter Vantorre <pietervantorre@gmail.com>
Category: common, system
*/

import { KeywordsDef, SyntaxDef, LanguageDef } from '../types';
import {
    BACKSLASH_ESCAPE,
    C_LINE_COMMENT_MODE,
    C_BLOCK_COMMENT_MODE,
    IDENT_RE,
    TITLE_MODE,
} from '../common';

const CPP_PRIMITIVE_TYPES = {
    className: 'keyword',
    begin: '\\b[a-z\\d_]*_t\\b'
};

export const STRINGS: SyntaxDef = {
    className: 'string',
    variants: [
        {
            begin: '(u8?|U)?L?"', end: '"',
            illegal: '\\n',
            contains: [BACKSLASH_ESCAPE]
        },
        {
            begin: '(u8?|U)?R"', end: '"',
            contains: [BACKSLASH_ESCAPE]
        },
        {
            begin: '\'\\\\?.', end: '\'',
            illegal: '.'
        }
    ]
};

const NUMBERS = {
    className: 'number',
    variants: [
        { begin: '\\b(0b[01\']+)' },
        { begin: '(-?)\\b([\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)(u|U|l|L|ul|UL|f|F|b|B)' },
        { begin: '(-?)(\\b0[xX][a-fA-F0-9\']+|(\\b[\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)([eE][-+]?[\\d\']+)?)' }
    ],
    relevance: 0
};

export const PREPROCESSOR: SyntaxDef = {
    className: 'meta',
    begin: /#\s*[a-z]+\b/, end: /$/,
    keywords: {
        'meta-keyword':
            'if else elif endif define undef warning error line ' +
            'pragma ifdef ifndef include'
    },
    contains: [
        {
            begin: /\\\n/, relevance: 0
        },
        { ...STRINGS, className: 'meta-string' },
        {
            className: 'meta-string',
            begin: /<[^\n>]*>/, end: /$/,
            illegal: '\\n',
        },
        C_LINE_COMMENT_MODE,
        C_BLOCK_COMMENT_MODE
    ]
};

const FUNCTION_TITLE = IDENT_RE + '\\s*\\(';

export const CPP_KEYWORDS: KeywordsDef = {
    keyword: 'int float while private char catch import module export virtual operator sizeof ' +
        'dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace ' +
        'unsigned long volatile static protected bool template mutable if public friend ' +
        'do goto auto void enum else break extern using asm case typeid ' +
        'short reinterpret_cast|10 default double register explicit signed typename try this ' +
        'switch continue inline delete alignof constexpr decltype ' +
        'noexcept static_assert thread_local restrict _Bool complex _Complex _Imaginary ' +
        'atomic_bool atomic_char atomic_schar ' +
        'atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong ' +
        'atomic_ullong new throw return ' +
        'and or not',
    built_in: 'std string cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream ' +
        'auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set ' +
        'unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos ' +
        'asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp ' +
        'fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper ' +
        'isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow ' +
        'printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp ' +
        'strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan ' +
        'vfprintf vprintf vsprintf endl initializer_list unique_ptr',
    literal: 'true false nullptr NULL'
};

const EXPRESSION_CONTAINS = [
    CPP_PRIMITIVE_TYPES,
    C_LINE_COMMENT_MODE,
    C_BLOCK_COMMENT_MODE,
    NUMBERS,
    STRINGS
];

export const CPlusPlus: LanguageDef = {
    name: 'cplusplus',
    aliases: ['c', 'cc', 'h', 'c++', 'h++', 'cpp', 'hpp'],
    keywords: CPP_KEYWORDS,
    illegal: '</',
    contains: [
        ...EXPRESSION_CONTAINS,
        PREPROCESSOR,
        {
            begin: '\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<', end: '>',
            keywords: CPP_KEYWORDS,
            contains: ['self', CPP_PRIMITIVE_TYPES]
        },
        {
            begin: IDENT_RE + '::',
            keywords: CPP_KEYWORDS
        },
        {
            // This mode covers expression context where we can't expect a function
            // definition and shouldn't highlight anything that looks like one:
            // `return some()`, `else if()`, `(x*sum(1, 2))`
            variants: [
                { begin: /=/, end: /;/ },
                { begin: /\(/, end: /\)/ },
                { beginKeywords: 'new throw return else', end: /;/ }
            ],
            keywords: CPP_KEYWORDS,
            contains: [
                ...EXPRESSION_CONTAINS,
                {
                    begin: /\(/, end: /\)/,
                    keywords: CPP_KEYWORDS,
                    contains: [...EXPRESSION_CONTAINS, 'self'],
                    relevance: 0
                }
            ],
            relevance: 0
        },
        {
            className: 'function',
            begin: '(' + IDENT_RE + '[\\*&\\s]+)+' + FUNCTION_TITLE,
            returnBegin: true, end: /[{;=]/,
            excludeEnd: true,
            keywords: CPP_KEYWORDS,
            illegal: /[^\w\s\*&]/,
            contains: [
                {
                    begin: FUNCTION_TITLE, returnBegin: true,
                    contains: [TITLE_MODE],
                    relevance: 0
                },
                {
                    className: 'params',
                    begin: /\(/, end: /\)/,
                    keywords: CPP_KEYWORDS,
                    relevance: 0,
                    contains: [
                        C_LINE_COMMENT_MODE,
                        C_BLOCK_COMMENT_MODE,
                        STRINGS,
                        NUMBERS,
                        CPP_PRIMITIVE_TYPES
                    ]
                },
                C_LINE_COMMENT_MODE,
                C_BLOCK_COMMENT_MODE,
                PREPROCESSOR
            ]
        },
        {
            className: 'class',
            beginKeywords: 'class struct', end: /[{;:]/,
            contains: [
                { begin: /</, end: />/, contains: ['self'] }, // skip generic stuff
                TITLE_MODE
            ]
        }
    ]
};
