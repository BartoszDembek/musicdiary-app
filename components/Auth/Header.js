import { View, StyleSheet,Text } from "react-native";

const Header = ({subtitle}) => {
    return (
        <View>
            <Text style={styles.logo}>MusicDiary</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#BB9AF7',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7AA2F7',
        marginBottom: 40,
        textAlign: 'center',
    },
})

export default Header;