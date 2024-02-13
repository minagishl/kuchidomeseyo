interface imageBodyProps {
  hideTitle: boolean;
  title: string;
}

export default function imageBody({ hideTitle, title }: imageBodyProps) {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100%',
        minWidth: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        backgroundColor: 'white',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          lineHeight: '2.5rem',
          fontFamily: 'NotoSerifJP, sans-serif',
          textAlign: 'center',
        }}
      >
        {hideTitle ? '？？？' : title ?? '？？？'}
      </h1>
    </main>
  );
}
