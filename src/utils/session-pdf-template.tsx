import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: { padding: 50, fontSize: 11, color: '#333', fontFamily: 'Helvetica' },
    header: { marginBottom: 30, borderBottom: 1, borderBottomColor: '#e5e7eb', paddingBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1d4ed8', marginBottom: 4 },
    professionalInfo: { fontSize: 10, color: '#6b7280' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
    content: { lineHeight: 1.6, textAlign: 'justify', color: '#1f2937' },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#f9fafb', padding: 10, borderRadius: 4 },
    footer: { position: 'absolute', bottom: 40, left: 50, right: 50, borderTop: 1, borderTopColor: '#e5e7eb', paddingTop: 10, textAlign: 'center', fontSize: 9, color: '#9ca3af' }
})

interface SessionPDFProps {
    psychologist: { name: string; crp?: string | null }
    patientName: string
    date: string
    content: string
    diagnosis?: string
}

export function SessionPDFTemplate({ psychologist, patientName, date, content, diagnosis }: SessionPDFProps) {
    return (
        <Document>
            <Page style={styles.page}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Text style={styles.title}>Prontuário de Atendimento Clínico</Text>
                    <Text style={styles.professionalInfo}>
                        {psychologist.name}
                        {psychologist.crp ? ` | CRP: ${psychologist.crp}` : ''}
                    </Text>
                </View>

                {/* Metadados da Sessão */}
                <View style={styles.metaRow}>
                    <View>
                        <Text style={{ fontSize: 9, color: '#6b7280' }}>Paciente</Text>
                        <Text style={{ fontWeight: 'bold' }}>{patientName}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 9, color: '#6b7280' }}>Data da Sessão</Text>
                        <Text style={{ fontWeight: 'bold' }}>{date}</Text>
                    </View>
                </View>

                {/* Diagnóstico (Opcional) */}
                {diagnosis && diagnosis !== "Não informado" && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Diagnóstico / Hipótese Diagnóstica</Text>
                        <Text style={styles.content}>{diagnosis}</Text>
                    </View>
                )}

                {/* Evolução / Conteúdo Principal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Evolução Psicológica</Text>
                    <Text style={styles.content}>{content}</Text>
                </View>

                {/* Rodapé de Validação */}
                <View style={styles.footer}>
                    <Text>Documento gerado eletronicamente em {new Date().toLocaleDateString('pt-BR')}</Text>
                    <Text>Este documento é confidencial e de uso restrito conforme o Código de Ética Profissional do Psicólogo.</Text>
                </View>
            </Page>
        </Document>
    )
}